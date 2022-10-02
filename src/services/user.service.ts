import { NotFoundException } from './../exceptions/not-found.exception';
import { GetUserOptions } from './../interfaces/user.interface';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import dataSource from 'src/configs/data-source';
import { User } from 'src/entities/user.entity';
import { FindOneOptions } from 'typeorm';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';

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
  // TODO: future use;
  // const user = getOneOrThrow({ where: { id: userId } });

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

  // TODO: handle status
  // if (dto?.status) {
  // }

  if (options?.id) {
    query.andWhere('u.id = :id', { id: options.id });
  }

  const [users, count] = await query.getManyAndCount();

  return {
    users,
    count,
  };
};
