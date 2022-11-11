import { LoginDto } from 'src/dto/auth';
import { UpdatePasswordUserDto } from 'src/dto/user/update-password-user.dto';
import * as bcrypt from 'bcrypt';
import Database from 'src/configs/Database';
import { CreateUserDto, GetUserDto, UpdateUserDto } from 'src/dto/user';
import { User } from 'src/entities/user.entity';
import { ExistsException } from 'src/exceptions/exists.exception';
import {
  NotExistException,
  NotFoundException,
} from 'src/exceptions/not-found.exception';
import { UnauthorizedException } from 'src/exceptions/unauthorized.exception';
import { EUserStatus, GetUserOptions } from 'src/interfaces/user.interface';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { FindOneOptions, Not } from 'typeorm';

const userRepository = Database.instance
  .getDataSource('default')
  .getRepository(User);

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

  const query = userRepository.createQueryBuilder('u');

  if (!options?.unlimited) {
    query.skip(offset).take(limit);
  }

  query.where('u.Id <> :id', { id: userId });

  if (dto?.q) {
    query.andWhere(
      '(full_name ILIKE :q OR username ILIKE :q OR phone ILIKE :q) AND u.id != :userId ',
      { q: `%${dto.q}%`, userId: userId }
    );
  }

  if (dto?.status) {
    query.andWhere('status = :s', { s: dto.status });
  }

  if (options?.id) {
    query.andWhere('u.id = :id', { id: options.id });
  }

  const [users, count] = await query.getManyAndCount();

  return {
    users,
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
  if ([EUserStatus.Deactivate, EUserStatus.Pending].includes(status)) {
    return false;
  }

  return true;
};
