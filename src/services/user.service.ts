import * as bcrypt from 'bcrypt';
import dataSource from 'src/configs/data-source';
import { FindOneOptions } from 'typeorm';
import { CreateUserDto, GetUserDto } from 'src/dto/user';
import { User } from 'src/entities/user.entity';
import { ExistsException, UnauthorizedException } from 'src/exceptions';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { GetUserOptions } from 'src/interfaces/user.interface';

const userRepository = dataSource.getRepository(User);

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

export const checkUsernameExists = async (username: string) => {
  const user = await getOne({ where: { username } });

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
  const user = new User();
  Object.assign(user, dto);

  return userRepository.save(user);
};
