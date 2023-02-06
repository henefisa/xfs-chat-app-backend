import { ConversationArchive } from 'src/entities/conversation-archived.entity';
import { GetMessageOptions } from 'src/interfaces/message.interface';
import Database from 'src/configs/Database';
import { Equal, FindOneOptions, QueryRunner } from 'typeorm';
import { InvalidSenderException } from 'src/exceptions/invalid.exception';
import {
  CountMessageDto,
  deleteMessageDto,
  GetMessageDto,
  hideMessageDto,
} from 'src/dto/message';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import * as userService from 'src/services/user.service';
import { Message, MessageHided } from 'src/entities';
import {
  checkConversationArchive,
  getOneConversationArchived,
} from './conversation.service';
import { Emotion } from 'src/entities/emotion.entity';
import { ExpressFeelingDto } from 'src/dto/emotion/express-feeling.dto';
import { NotExistException, NotFoundException } from 'src/exceptions';

const emotionRepository = Database.instance
  .getDataSource('default')
  .getRepository(Emotion);

const messageRepository = Database.instance
  .getDataSource('default')
  .getRepository(Message);

const messageHidedRepository = Database.instance
  .getDataSource('default')
  .getRepository(MessageHided);

const conversationArchivedRepository = Database.instance
  .getDataSource('default')
  .getRepository(ConversationArchive);

export const createMessage = async (
  conversation: string,
  sender: string,
  text: string,
  attachment: string,
  queryRunner?: QueryRunner
) => {
  const user = await userService.getOneOrThrow({ where: { id: sender } });
  const message = new Message();

  const request = {
    sender: sender,
    message: text,
    conversation: conversation,
    attachment,
  };

  Object.assign(message, request);
  if (queryRunner) {
    const newMessage = await queryRunner.manager
      .withRepository(messageRepository)
      .save(message);
    await unarchive(conversation, queryRunner);
    await queryRunner.commitTransaction();
    return {
      user: user,
      message: newMessage,
    };
  }
  const newMessage = await messageRepository.save(message);
  return {
    user: user,
    message: newMessage,
  };
};

export const unarchive = async (
  conversationId: string,
  queryRunner: QueryRunner
) => {
  const conversationArchived = await getOneConversationArchived({
    where: { conversation: Equal(conversationId) },
  });
  if (!conversationArchived || !conversationArchived.isHided) {
    return;
  }
  conversationArchived.isHided = false;
  await queryRunner.manager
    .withRepository(conversationArchivedRepository)
    .save(conversationArchived);
};

export const deleteMessage = async (dto: deleteMessageDto, id: string) => {
  await checkSenderValid(id, dto.messageId);

  const hideMessage = await getOne({
    where: { message: Equal(dto.messageId) },
  });

  if (hideMessage) {
    await deleteHideMessage(hideMessage.id);
  }

  return messageRepository.delete({ id: dto.messageId, sender: Equal(id) });
};

export const hideMessage = async (dto: hideMessageDto, id: string) => {
  const hideMessage = new MessageHided();
  const request = {
    eraser: id,
    message: dto.messageId,
  };
  Object.assign(hideMessage, request);

  return messageHidedRepository.save(hideMessage);
};

export const getOneOrThrow = async (options: FindOneOptions<Message>) => {
  const message = await messageRepository.findOne(options);

  if (!message) {
    throw new NotFoundException('message');
  }

  return message;
};

export const getMessages = async (
  conversation: string,
  id: string,
  dto?: GetMessageDto,
  options?: GetMessageOptions
) => {
  const query = messageRepository.createQueryBuilder('m');

  const { offset, limit } = getLimitAndOffset({
    limit: dto?.limit,
    offset: dto?.offset,
  });

  const conversationArchive = await checkConversationArchive(conversation, id);

  if (!options?.unlimited) {
    query.skip(offset).take(limit);
  }

  query
    .andWhere('m.conversation = :conversation', { conversation: conversation })
    .leftJoinAndSelect('m.sender', 'users');

  if (conversationArchive && conversationArchive.deletedAt !== null) {
    query
      .leftJoinAndSelect('m.conversation', 'c')
      .leftJoinAndSelect(
        ConversationArchive,
        'conversationArchive',
        'conversationArchive.conversation = c.id'
      )
      .andWhere('m.createdAt > conversationArchive.deletedAt');
  }

  if (dto?.q) {
    query.andWhere('m.message ILIKE :q', { q: dto.q });
  }

  if (options?.id) {
    query.andWhere('m.id = :id', { id: options.id });
  }

  query.orderBy('m.createdAt', 'DESC');

  const [messages, count] = await query.getManyAndCount();

  return {
    messages,
    count,
  };
};

export const deleteHideMessage = async (id: string) => {
  return messageHidedRepository.delete({ id: id });
};

export const getOne = async (options: FindOneOptions<MessageHided>) => {
  return messageHidedRepository.findOne(options);
};

export const checkSenderValid = async (senderId: string, messageId: string) => {
  const message = await messageRepository.findOne({
    where: {
      id: Equal(messageId),
      sender: Equal(senderId),
    },
  });

  if (!message) {
    throw new InvalidSenderException();
  }

  return message;
};

export const countMessagesOfUser = async (
  userId: string,
  dto?: CountMessageDto
) => {
  const query = messageRepository
    .createQueryBuilder('m')
    .where('m.senderId = :userId', { userId });

  if (dto?.conversationId) {
    query.andWhere('(m.conversationId = :id)', { id: dto.conversationId });
  }

  return query.getCount();
};

export const createObjectExpressFeeling = (
  messageId: string,
  type: string,
  userId: string
) => {
  const emotion = new Emotion();

  const request = {
    type: type,
    message: messageId,
    user: userId,
  };

  Object.assign(emotion, request);
  return emotion;
};

export const getEmotions = async (messageId: string) => {
  const emotions = await emotionRepository.findOne({
    where: {
      message: Equal(messageId),
    },
  });

  if (!emotions) {
    throw new NotExistException('emotions');
  }

  return emotions;
};

export const expressFeeling = async (
  dto: ExpressFeelingDto,
  userId: string
) => {
  let emotion = await emotionRepository.findOne({
    where: {
      message: Equal(dto.messageId),
      user: Equal(userId),
    },
  });

  if (!emotion) {
    emotion = createObjectExpressFeeling(dto.messageId, dto.type, userId);
  }

  emotion.type = dto.type;

  return emotionRepository.save(emotion);
};
