import { sendMessageDto } from 'src/dto/message/send-message.dto';
import Database from 'src/configs/Database';
import { Message } from 'src/entities/message.entity';
import { deleteMessageDto } from 'src/dto/message/delete-messages.dto';
import { FindOneOptions } from 'typeorm';
import { hideMessageDto } from 'src/dto/message/hide-message.dto';
import { HideMessage } from 'src/entities/hide-message.entity';

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

export const deleteMessage = async (dto: deleteMessageDto) => {
  return messageRepository.delete({ id: dto.messageId });
};

export const getOne = async (option: FindOneOptions<Message>) => {
  return messageRepository.findOne(option);
};

export const hideMessage = async (dto: hideMessageDto, id: string) => {
  const hideMessage = new HideMessage();
  const request = {
    eraser: id,
    message: dto.messageId,
  };
  Object.assign(hideMessage, request);

  return hideMessageRepository.save(hideMessage);
};

export const getMessages = async (conversation: string, id: string) => {
  const query = messageRepository.createQueryBuilder('m');
  query.leftJoinAndSelect('m.hideMessage', 'hide_message');
  query.leftJoinAndSelect('hide_message.eraser', 'users');
  query.where('m.conversation = :id', { id: conversation });
  query.where('hide_message.eraser <> :id', { id: id });

  const messages = await query.getMany();

  return messages;
};
