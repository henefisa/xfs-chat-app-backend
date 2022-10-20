import { GetMessageOptions } from './../interfaces/message.interface';
import { sendMessageDto } from './../dto/message/send-message.dto';
import Database from 'src/configs/Database';
import { Message } from 'src/entities/message.entity';
import { GetMessageDto } from 'src/dto/message/get-message.dto';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';

const messageRepository = Database.instance
  .getDataSource('default')
  .getRepository(Message);

export const createMessage = (dto: sendMessageDto) => {
  const message = new Message();
  Object.assign(message, dto);
  return messageRepository.save(message);
};

export const getMessages = async (
  conversationId?: string,
  dto?: GetMessageDto,
  options?: GetMessageOptions
) => {
  const { limit, offset } = getLimitAndOffset({
    limit: dto?.limit,
    offset: dto?.offset,
  });

  const query = messageRepository.createQueryBuilder('m');

  if (!options?.unlimited) {
    query.skip(offset).take(limit);
  }

  if (conversationId) {
    query.andWhere('conversationId = :q', { q: conversationId });
  }

  if (dto?.q) {
    query.andWhere('message = :q', { q: dto.q });
  }

  if (dto?.status) {
    query.andWhere('status = :s', { s: dto.status });
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
export const deleteMessage = async (id: string) => {
  return messageRepository.delete(id);
};
