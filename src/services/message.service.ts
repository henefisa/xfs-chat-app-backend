import { GetMessageOptions } from 'src/interfaces/message.interface';
import Database from 'src/configs/Database';
import { Equal, FindOneOptions } from 'typeorm';
import { InvalidSenderException } from 'src/exceptions/invalid.exception';
import {
  CountMessageDto,
  deleteMessageDto,
  GetMessageDto,
  hideMessageDto,
} from 'src/dto/message';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { getOneOrThrow } from './user.service';
import { Message, MessageHided } from 'src/entities';
import { Emotion } from 'src/entities/emotion.entity';
import { expressFeelingDto } from 'src/dto/emoticon/express-feeling.dto';
import { NotExistException } from 'src/exceptions';

const emotionRepository = Database.instance
  .getDataSource('default')
  .getRepository(Emotion);

const messageRepository = Database.instance
  .getDataSource('default')
  .getRepository(Message);

const messageHidedRepository = Database.instance
  .getDataSource('default')
  .getRepository(MessageHided);

export const createMessage = async (
  conversation: string,
  sender: string,
  text: string,
  attachment?: string
) => {
  const user = await getOneOrThrow({ where: { id: sender } });
  const message = new Message();

  const request = {
    sender: sender,
    message: text,
    conversation: conversation,
  };

  Object.assign(message, request);

  if (attachment) {
    message.attachment = attachment;
  }

  return {
    user: user,
    message: await messageRepository.save(message),
  };
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

  if (!options?.unlimited) {
    query.skip(offset).take(limit);
  }

  query
    .andWhere('m.conversation = :conversation', { conversation: conversation })
    .leftJoinAndSelect('m.sender', 'users');

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
  dto: expressFeelingDto,
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
