import Database from 'src/configs/Database';
import { Equal, FindOneOptions } from 'typeorm';
import { ConversationReader } from 'src/entities';
import { ConversationReaderDto } from 'src/dto/conversation';
import moment from 'moment';
import * as userService from 'src/services/user.service';
import * as conversationService from 'src/services/conversation.service';

const conversationReaderRepository = Database.instance
  .getDataSource('default')
  .getRepository(ConversationReader);

export const getOne = async (options: FindOneOptions<ConversationReader>) => {
  return conversationReaderRepository.findOne(options);
};

export const createConversationReader = async (dto: ConversationReaderDto) => {
  const conversationReader = new ConversationReader();
  const user = await userService.getOneOrThrow({ where: { id: dto.userId } });
  const conversation = await conversationService.getOneOrThrow({
    where: { id: dto.conversationId },
  });
  Object.assign(conversationReader, { user, conversation });
  return conversationReaderRepository.save(conversationReader);
};

export const updateConversationReader = async (dto: ConversationReaderDto) => {
  const oldConversationReader = await getOne({
    where: {
      conversation: Equal(dto.conversationId),
      user: Equal(dto.userId),
    },
  });

  if (oldConversationReader) {
    oldConversationReader.updatedAt = moment();
    return conversationReaderRepository.save(oldConversationReader);
  }

  return createConversationReader(dto);
};

export const getConversationReaderByConversationId = async (
  conversationId: string
) => {
  const query = conversationReaderRepository.createQueryBuilder('m');
  query
    .andWhere('m.conversation = :conversation', {
      conversation: conversationId,
    })
    .leftJoinAndSelect('m.user', 'user');

  query.orderBy('m.createdAt', 'DESC');

  const [conversationReaders, count] = await query.getManyAndCount();
  return {
    conversationReaders,
    count,
  };
};
