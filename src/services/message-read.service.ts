import Database from 'src/configs/Database';
import { CreateMessageReadDto } from 'src/dto/message';
import { MessageRead } from 'src/entities';
import * as userService from 'src/services/user.service';
import * as conversationService from 'src/services/conversation.service';
import { Equal, FindOneOptions } from 'typeorm';

const messageReadRepository = Database.instance
  .getDataSource('default')
  .getRepository(MessageRead);

export const getOne = async (options: FindOneOptions<MessageRead>) => {
  return messageReadRepository.findOne(options);
};

export const deleteCurrentMessageRead = async (dto: CreateMessageReadDto) => {
  const currentMessageRead = await getOne({
    where: {
      conversation: Equal(dto.conversationId),
      user: Equal(dto.userId),
    },
  });

  if (currentMessageRead) {
    return messageReadRepository.delete(currentMessageRead.id);
  }
};

export const createMessageRead = async (dto: CreateMessageReadDto) => {
  const user = await userService.getOneOrThrow({ where: { id: dto.userId } });

  const conversation = await conversationService.getOneOrThrow({
    where: { id: dto.conversationId },
  });

  await deleteCurrentMessageRead(dto);

  const messageRead = new MessageRead();
  Object.assign(messageRead, { user, conversation });
  return messageReadRepository.save(messageRead);
};

export const getMessageReadsByMessageId = async (conversationId: string) => {
  const query = messageReadRepository.createQueryBuilder('m');
  query
    .andWhere('m.conversation = :conversation', {
      conversation: conversationId,
    })
    .leftJoinAndSelect('m.user', 'user');

  query.orderBy('m.createdAt', 'DESC');

  const [messageReads, count] = await query.getManyAndCount();
  return {
    messageReads,
    count,
  };
};
