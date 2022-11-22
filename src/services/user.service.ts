import * as bcrypt from 'bcrypt';
import Database from 'src/configs/Database';
import { LoginDto } from 'src/dto/auth';
import { CreateUserDto, GetUserDto, UpdateUserDto } from 'src/dto/user';
import { UpdatePasswordUserDto } from 'src/dto/user/update-password-user.dto';
import { User } from 'src/entities/user.entity';
import { UserFriend } from 'src/entities/user-friend.entity';
import { ExistsException } from 'src/exceptions/exists.exception';
import {
  NotExistException,
  NotFoundException,
} from 'src/exceptions/not-found.exception';
import { UnauthorizedException } from 'src/exceptions/unauthorized.exception';
import { EUserStatus, GetUserOptions } from 'src/interfaces/user.interface';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { FindOneOptions, Not } from 'typeorm';
import { EUserFriendRequestStatus } from 'src/interfaces/user-friend.interface';

const userRepository = Database.instance
  .getDataSource('default')
  .getRepository(User);

const userFriendRepository = Database.instance
  .getDataSource('default')
  .getRepository(UserFriend);

export const getOneOrThrow = async (options: FindOneOptions<User>) => {
  const user = await userRepository.findOne(options);

  if (!user) {
    throw new NotFoundException('user');
  }

  return user;
};

export const getOne = async (options: FindOneOptions<User>) => {
  return userRepository.findOne(options);
};

export const getUsers = async (
  userId: string,
  dto?: GetUserDto,
  options?: GetUserOptions
) => {
  const { limit, offset } = getLimitAndOffset({
    limit: dto?.limit,
    offset: dto?.offset,
  });

  const query = userRepository
    .createQueryBuilder('u')
    .andWhere('u.id != :userId', { userId })
    .andWhere('u.status = :status', {
      status: EUserStatus.Active,
    });

  if (!options?.unlimited) {
    query.skip(offset).take(limit);
  }

  if (dto?.q) {
    query.andWhere(
      '(full_name ILIKE :q OR username ILIKE :q OR phone ILIKE :q) ',
      {
        q: `%${dto.q}%`,
      }
    );
  }

  if (dto?.status) {
    query.andWhere('status = :s', { s: dto.status });
  }

  if (options?.id) {
    query.andWhere('u.id = :id', { id: options.id });
  }

  const [users, count] = await query.getManyAndCount();

  const promises = users.map(async (user) => {
    const friendStatus = userFriendRepository
      .createQueryBuilder('uf')
      .where(`uf.ownerId = :userId AND uf.userTargetId = :targetId`, {
        userId,
        targetId: user.id,
      })
      .orWhere(`uf.userTargetId = :userId AND uf.ownerId = :targetId`, {
        userId,
        targetId: user.id,
      })
      .andWhere('uf.status != :s', { s: EUserFriendRequestStatus.REJECTED })
      .innerJoin('uf.owner', 'owner')
      .innerJoin('uf.userTarget', 'userTarget')
      .addSelect('owner.id')
      .addSelect('userTarget.id')
      .orderBy('uf.createdAt', 'DESC');

    return {
      ...user,
      friendStatus: await friendStatus.getOne(),
    };
  });

  const usersWithFriendStatus = await Promise.all(promises);

  return {
    users: usersWithFriendStatus,
    count,
  };
};

export const checkUsernameExists = async (
  username: string,
  userId?: string
) => {
  const user = await getOne({
    where: { username, id: userId && Not(userId) },
  });

  if (user) {
    throw new ExistsException('username');
  }

  return false;
};

export const checkEmailExists = async (email: string, userId?: string) => {
  const user = await getOne({ where: { email, id: userId && Not(userId) } });

  if (user) {
    throw new ExistsException('email');
  }

  return false;
};

export const checkPhoneExists = async (phone: string, userId?: string) => {
  const user = await getOne({ where: { phone, id: userId && Not(userId) } });

  if (user) {
    throw new ExistsException('phone');
  }

  return false;
};

export const checkRegisterUsernameExists = async (username: string) => {
  try {
    const user = await getOne({
      where: { username: username },
    });

    if (user) {
      throw new ExistsException('username');
    }

    return false;
  } catch (error) {
    return true;
  }
};

export const checkRegisterEmailExists = async (email: string) => {
  try {
    const user = await getOne({ where: { email: email } });

    if (user) {
      throw new ExistsException('email');
    }

    return false;
  } catch (error) {
    return true;
  }
};

export const comparePassword = async (dto: LoginDto) => {
  const user = await userRepository
    .createQueryBuilder('u')
    .where('username = :username', { username: dto.username })
    .orWhere('email = :email ', { email: dto.username })
    .addSelect('u.password')
    .getOne();

  if (!user) {
    throw new UnauthorizedException();
  }

  const isMatch = await bcrypt.compare(dto.password, user.password);

  if (!isMatch) {
    throw new UnauthorizedException();
  }

  return user;
};

export const createUser = async (dto: CreateUserDto) => {
  await checkUsernameExists(dto.username);
  await checkEmailExists(dto.email);

  const user = new User();
  Object.assign(user, dto);
  user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());

  return userRepository.save(user);
};

export const updateUser = async (dto: UpdateUserDto, id: string) => {
  const user = await getOneOrThrow({
    where: { id: id },
  });

  if (!user) {
    throw new NotExistException('user');
  }

  if (dto.email) {
    await checkEmailExists(dto.email, user.id);
  }
  if (dto.username) {
    await checkUsernameExists(dto.username, user.id);
  }
  if (dto.phone) {
    await checkPhoneExists(dto.phone, user.id);
  }

  Object.assign(user, dto);
  return userRepository.save(user);
};

export const deleteUser = async (id: string) => {
  return userRepository.delete(id);
};

export const updateProfileUser = async (dto: UpdateUserDto, id: string) => {
  const user = await getOneOrThrow({
    where: { id: id },
  });

  if (!user) {
    throw new NotExistException('user');
  }

  if (dto.email) {
    await checkEmailExists(dto.email, user.id);
  }
  if (dto.username) {
    await checkUsernameExists(dto.username, user.id);
  }
  if (dto.phone) {
    await checkPhoneExists(dto.phone, user.id);
  }

  Object.assign(user, dto);
  return userRepository.save(user);
};

export const updatePasswordUser = async (
  dto: UpdatePasswordUserDto,
  id: string
) => {
  const user = await getOneOrThrow({
    where: { id: id },
  });

  user.password = await bcrypt.hash(dto.password, await bcrypt.genSalt());

  return userRepository.save(user);
};

export const Deactivate = async (id: string) => {
  const user = await getOneOrThrow({
    where: { id: id },
  });

  user.status = EUserStatus.Deactivate;

  return userRepository.save(user);
};

export const checkActivateValidation = async (status: EUserStatus) => {
  if ([EUserStatus.Deactivate, EUserStatus.Inactive].includes(status)) {
    return false;
  }

  return true;
};
