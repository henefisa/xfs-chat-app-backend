import * as bcrypt from 'bcrypt';
import Database from 'src/configs/Database';
import redis from 'src/configs/Redis';
import { AdminUpdateRoleUserDto } from 'src/dto/admin';
import { LoginDto } from 'src/dto/auth';
import {
  CreateUserDto,
  GetUserDto,
  UpdatePasswordUserDto,
  UpdateUserDto,
} from 'src/dto/user';
import { Conversation, Participants, User, UserFriend } from 'src/entities';
import {
  ExistsException,
  NotExistException,
  NotFoundException,
  UnauthorizedException,
} from 'src/exceptions';
import {
  EUserActiveStatus,
  EUserFriendRequestStatus,
  EUserStatus,
  GetUserOptions,
} from 'src/interfaces';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { getOnlineIdKey } from 'src/utils/redis';
import { FindOneOptions, Not } from 'typeorm';

const userRepository = Database.instance
  .getDataSource('default')
  .getRepository(User);

const userFriendRepository = Database.instance
  .getDataSource('default')
  .getRepository(UserFriend);

const conversationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Conversation);

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
    .andWhere('u.activeStatus = :status', {
      status: EUserActiveStatus.Active,
    })
    .leftJoin(UserFriend, 'f', 'f.ownerId = u.id OR f.userTargetId = u.id');

  if (dto?.friendStatus) {
    query.andWhere('(f.userTargetId = :userId OR f.ownerId = :userId )', {
      userId,
    });
    query.andWhere(' (f.status = :s OR f.status = :s)', {
      s: dto.friendStatus,
    });
  }

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

    const friend = await friendStatus.getOne();

    const conversation = conversationRepository
      .createQueryBuilder('c')
      .leftJoin(Participants, 'p', 'p.conversationId = c.id')
      .where('(p.userId = :userId AND p.adderId = :adder)')
      .orWhere('(p.adder = :userId AND p.userId = :adder)')
      .setParameters({ userId, adder: user.id })
      .andWhere('c.is_group = false');

    return {
      ...user,
      friendStatus: friend,
      conversation: await conversation.getOne(),
    };
  });

  const userWithFriendStatus = await Promise.all(promises);

  return {
    users: userWithFriendStatus,
    count: count,
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

export const updateRoleUser = async (
  id: string,
  dto?: AdminUpdateRoleUserDto
) => {
  const user = await getOneOrThrow({
    where: { id: id },
  });

  if (!user) {
    throw new NotExistException('user');
  }

  if (dto?.role) {
    user.role = dto.role;
  }

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

  user.activeStatus = EUserActiveStatus.Deactivate;

  return userRepository.save(user);
};

export const checkActivateValidation = async (status: EUserActiveStatus) => {
  if (
    [
      EUserActiveStatus.Deactivate,
      EUserActiveStatus.Inactive,
      EUserActiveStatus.Banned,
    ].includes(status)
  ) {
    return false;
  }

  return true;
};

export const addIdOnline = async (key: string, data: string) => {
  const id = await redis.get(key);
  if (!id) {
    const arrToString = JSON.stringify([data]);
    return redis.set(key, arrToString);
  }
  const arrId = JSON.parse(id);
  const arrToString = JSON.stringify([...arrId, data]);
  return redis.set(key, arrToString);
};

export const setIdOffline = async (key: string, data: string) => {
  const id = await redis.get(key);
  if (!id) {
    return [];
  }
  const arrId = JSON.parse(id);
  return arrId.filter((id: string) => id !== data);
};

export const setOnline = async (userId: string, socketId: string) => {
  const user = await getOneOrThrow({
    where: { id: userId },
  });
  const key = getOnlineIdKey(user.id);
  await addIdOnline(key, socketId);
  user.status = EUserStatus.ONLINE;
  return userRepository.save(user);
};

export const setOffline = async (userId: string, socketId: string) => {
  const user = await getOneOrThrow({
    where: { id: userId },
  });
  const key = getOnlineIdKey(user.id);
  const data = await setIdOffline(key, socketId);
  if (data.length === 0) {
    user.status = EUserStatus.OFFLINE;
    await redis.del(key);
    return await userRepository.save(user);
  }
  await redis.set(key, JSON.stringify(data));
};

export const getAllUsers = async (
  dto?: GetUserDto,
  options?: GetUserOptions
) => {
  const query = userRepository.createQueryBuilder('u');

  const { offset, limit } = getLimitAndOffset({
    limit: dto?.limit,
    offset: dto?.offset,
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

  query.orderBy('u.createdAt', 'DESC');

  const [users, count] = await query.getManyAndCount();

  return {
    users,
    count,
  };
};

export const banUser = async (userId: string) => {
  const user = await getOneOrThrow({ where: { id: userId } });

  user.activeStatus = EUserActiveStatus.Banned;

  return userRepository.save(user);
};

export const unbannedUser = async (userId: string) => {
  const user = await getOneOrThrow({ where: { id: userId } });

  user.activeStatus = EUserActiveStatus.Active;

  return userRepository.save(user);
};
