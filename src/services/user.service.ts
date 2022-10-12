import * as bcrypt from 'bcrypt';
import Database from 'src/configs/Database';
import { CreateUserDto, GetUserDto, UpdateUserDto } from 'src/dto/user';
import { User } from 'src/entities/user.entity';
import { ExistedException } from 'src/exceptions/existed.exception';
import { ExistsException } from 'src/exceptions/exists.exception';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { UnauthorizedException } from 'src/exceptions/unauthorized.exception';
import { GetUserOptions } from 'src/interfaces/user.interface';
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

export const checkUserToUpdate = async (id: string, dto: UpdateUserDto) => {
  const query = userRepository.createQueryBuilder('u');
  const u = await query
    .where('u.username = :username', { username: dto.username })
    .andWhere('u.id <> :id', { id: id })
    .getOne();

  if (u) {
    throw new ExistedException(dto.username);
  }

  const uphone = await query
    .where('u.phone = :phone', { phone: dto.phone })
    .andWhere('u.id <> :id', { id: id })
    .getOne();
  if (uphone) {
    throw new ExistedException(dto.phone);
  }
  const user = await query
    .where('u.email = :email', { email: dto.email })
    .andWhere('u.id <> :id', { id: id })
    .getOne();
  if (user) {
    throw new ExistedException(dto.username);
  }
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

  if (dto?.q) {
    query.andWhere('full_name ILIKE :q', { q: dto.q });
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
  const user = await getOne({ where: { username, id: userId && Not(userId) } });

  if (user) {
    throw new ExistsException('username');
  }

  return true;
};

export const checkEmailExists = async (email: string, userId?: string) => {
  const user = await getOne({ where: { email, id: userId && Not(userId) } });

  if (user) {
    throw new ExistsException('username');
  }

  return true;
};

export const comparePassword = async (username: string, password: string) => {
  const user = await userRepository
    .createQueryBuilder('u')
    .where('username = :username', { username })
    .addSelect('u.password')
    .getOne();

  if (!user) {
    throw new UnauthorizedException();
  }

  const isMatch = await bcrypt.compare(password, user.password);

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
  checkUserToUpdate(id, dto);
  Object.assign(user, dto);
  return await userRepository.save(user);
};

export const deleteUser = async (id: string) => {
  return await userRepository.delete(id);
};
