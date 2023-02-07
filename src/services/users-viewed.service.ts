import Database from 'src/configs/Database';
import * as userService from 'src/services/user.service';
import * as conversationService from 'src/services/conversation.service';
import { Equal, FindOneOptions } from 'typeorm';
import { UsersViewed } from 'src/entities';
import { CreateUserViewedDto } from 'src/dto/message';

const userViewedRepository = Database.instance
  .getDataSource('default')
  .getRepository(UsersViewed);

export const getOne = async (options: FindOneOptions<UsersViewed>) => {
  return userViewedRepository.findOne(options);
};

export const deleteOldUsersViewed = async (dto: CreateUserViewedDto) => {
  const oldUsersViewed = await getOne({
    where: {
      conversation: Equal(dto.conversationId),
      user: Equal(dto.userId),
    },
  });

  if (oldUsersViewed) {
    return userViewedRepository.delete(oldUsersViewed.id);
  }
};

export const createUsersViewed = async (dto: CreateUserViewedDto) => {
  const user = await userService.getOneOrThrow({ where: { id: dto.userId } });

  const conversation = await conversationService.getOneOrThrow({
    where: { id: dto.conversationId },
  });

  await deleteOldUsersViewed(dto);

  const usersViewed = new UsersViewed();
  Object.assign(usersViewed, { user, conversation });
  return userViewedRepository.save(usersViewed);
};

export const getUsersViewedByConversationId = async (
  conversationId: string
) => {
  const query = userViewedRepository.createQueryBuilder('m');
  query
    .andWhere('m.conversation = :conversation', {
      conversation: conversationId,
    })
    .leftJoinAndSelect('m.user', 'user');

  query.orderBy('m.createdAt', 'DESC');

  const [usersViewed, count] = await query.getManyAndCount();
  return {
    usersViewed,
    count,
  };
};
