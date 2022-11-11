import { sendMessageDto } from 'src/dto/message/send-message.dto';
import Database from 'src/configs/Database';
import { Message } from 'src/entities/message.entity';
import { deleteMessageDto } from 'src/dto/message/delete-messages.dto';
import { FindOneOptions } from 'typeorm';

const messageRepository = Database.instance
  .getDataSource('default')
  .getRepository(Message);

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
