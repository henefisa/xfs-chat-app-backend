import Database from 'src/configs/Database';
import { Message } from 'src/entities/message.entity';
import { deleteMessageDto } from 'src/dto/message/delete-messages.dto';
import { hideMessageDto } from 'src/dto/message/hide-message.dto';
import { Equal, FindOneOptions } from 'typeorm';
import { InvalidSenderException } from 'src/exceptions/invalid.exception';
import { MessageHided } from 'src/entities/message-hided.entity';

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

export const getMessages = async (conversation: string, id: string) => {
  const query = messageRepository.createQueryBuilder('m');
  query
    .leftJoinAndSelect('m.hideMessage', 'message_hided')
    .leftJoinAndSelect('message_hided.eraser', 'users')
    .where('message_hided.eraser != :eraserId', {
      eraserId: id,
    })
    .orWhere('message_hided.eraser IS NULL')
    .andWhere('m.conversation = :conversation', { conversation: conversation });

  const messages = await query.getMany();

  return messages;
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
