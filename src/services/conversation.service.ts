import { GetConversationOptions } from 'src/interfaces/conversation.interface';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { GetConversationDto } from 'src/dto/conversation/get-conversation.dto';
import Database from 'src/configs/Database';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { FindOneOptions } from 'typeorm';

const conversationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Conversation);

export const createConversation = async (dto: CreateConversationDto) => {
  const newConversation = new Conversation();

  Object.assign(newConversation, dto);

  return conversationRepository.save(newConversation);
};

export const getOne = async (options: FindOneOptions<Conversation>) => {
  return conversationRepository.findOne(options);
};

export const getConversationsOfUser = async (
  userId: string,
  dto?: GetConversationDto,
  options?: GetConversationOptions
) => {
  const { limit, offset } = getLimitAndOffset({
    limit: dto?.limit,
    offset: dto?.offset,
  });

  const query = conversationRepository.createQueryBuilder('conversation');

  if (!options?.unlimited) {
    query.skip(offset).take(limit);
  }

  query
    .leftJoin('conversation.participants', 'participants')
    .leftJoin('participants.user', 'users')
    .andWhere('participants.userId = :userId', { userId });

  if (dto?.q) {
    query.andWhere(
      'title ILIKE :q  OR username ILIKE :q OR full_name ILIKE :q',
      { q: `%${dto.q}%` }
    );
  }

  if (options?.id) {
    query.andWhere('conversation.id = :id', { id: options.id });
  }

  const [conversations, count] = await query.getManyAndCount();

  return {
    conversations,
    count,
  };
};
