import { GetMessageOptions } from 'src/interfaces/message.interface';
import Database from 'src/configs/Database';
import { Message } from 'src/entities/message.entity';
import { Equal, FindOneOptions } from 'typeorm';
import { InvalidSenderException } from 'src/exceptions/invalid.exception';
import { MessageHided } from 'src/entities/message-hided.entity';
import {
  deleteMessageDto,
  GetMessageDto,
  hideMessageDto,
} from 'src/dto/message';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';

const messageRepository = Database.instance
  .getDataSource('default')
  .getRepository(Message);

const messageHidedRepository = Database.instance
  .getDataSource('default')
  .getRepository(MessageHided);

export const createMessage = async (
  conversation: string,
  sender: string,
  text: string
) => {
  const message = new Message();

  const request = {
    sender: sender,
    message: text,
    conversation: conversation,
  };

  Object.assign(message, request);

  return messageRepository.save(message);
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
