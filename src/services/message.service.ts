import { sendMessageDto } from 'src/dto/message/send-message.dto';
import Database from 'src/configs/Database';
import { Message } from 'src/entities/message.entity';
import { deleteMessageDto } from 'src/dto/message/delete-messages.dto';
import { hideMessageDto } from 'src/dto/message/hide-message.dto';
import { HideMessage } from 'src/entities/hide-message.entity';
import { Equal, FindOneOptions } from 'typeorm';
import { InValidException } from 'src/exceptions/invalid.exception';

const messageRepository = Database.instance
  .getDataSource('default')
  .getRepository(Message);

const hideMessageRepository = Database.instance
  .getDataSource('default')
  .getRepository(HideMessage);

export const createMessage = async (dto: sendMessageDto, id: string) => {
  const message = new Message();

  const request = {
    sender: id,
    message: dto.message,
    conversation: dto.conversation,
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
  const hideMessage = new HideMessage();
  const request = {
    user: id,
    message: dto.messageId,
  };
  Object.assign(hideMessage, request);

  return hideMessageRepository.save(hideMessage);
};

export const getMessages = async (conversation: string, id: string) => {
  const query = messageRepository.createQueryBuilder('m');
  query
    .leftJoinAndSelect('m.hideMessage', 'hide_message')
    .leftJoinAndSelect('hide_message.user', 'users')
    .where('hide_message.user != :userId', {
      userId: id,
    })
    .orWhere('hide_message.user IS NULL')
    .andWhere('m.conversation = :conversation', { conversation: conversation });

  const messages = await query.getMany();

  return messages;
};

export const deleteHideMessage = async (id: string) => {
  return hideMessageRepository.delete({ id: id });
};

export const getOne = async (options: FindOneOptions<HideMessage>) => {
  return hideMessageRepository.findOne(options);
};

export const checkSenderValid = async (senderId: string, messageId: string) => {
  const message = await messageRepository.findOne({
    where: {
      id: Equal(messageId),
      sender: Equal(senderId),
    },
  });

  if (!message) {
    throw new InValidException();
  }

  return message;
};
