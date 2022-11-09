import { sendMessageDto } from 'src/dto/message/send-message.dto';
import Database from 'src/configs/Database';
import { Message } from 'src/entities/message.entity';

const messageRepository = Database.instance
  .getDataSource('default')
  .getRepository(Message);

export const createMessage = async (dto: sendMessageDto, id: string) => {
  const message = new Message();

  const request = {
    sender: id,
    message: dto.message,
    conversationId: dto.conversationId,
  };

  Object.assign(message, request);

  return messageRepository.save(message);
};
