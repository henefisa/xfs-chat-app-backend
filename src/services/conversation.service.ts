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
      '(title ILIKE :q  OR username ILIKE :q OR full_name ILIKE :q) AND participants.userId = :userId ',
      { q: `%${dto.q}%`, userId: userId }
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

export const getGroups = async (
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
    .addGroupBy('conversation.id')
    .having('COUNT(participants.userId) > 2');

  if (dto?.q) {
    query.andWhere(
      '(title ILIKE :q  OR username ILIKE :q OR full_name ILIKE :q)',
      { q: `%${dto.q}%` }
    );
  }

  if (options?.id) {
    query.andWhere('conversation.id = :id', { id: options.id });
  }

  const conversations = await query.getMany();

  const c: Conversation[] = [];

  for (const i of conversations) {
    const conv = conversationRepository
      .createQueryBuilder('conv')
      .leftJoin('conv.participants', 'participants')
      .where('conv.id = :id', { id: i.id })
      .andWhere('participants.userId = :userId', { userId: userId });
    const con = await conv.getOne();
    if (con) {
      c.push(con);
    }
  }

  return c;
};

export const checkConversationExists = async (
  userTargetId: string,
  ownerId: string
) => {
  const query = await conversationRepository.createQueryBuilder('c');
  query
    .leftJoinAndSelect('c.participants', 'participants')
    .where(
      'participants.user = :userTargetId AND participants.adder = :ownerId',
      { userTargetId: userTargetId, ownerId: ownerId }
    )
    .orWhere(
      'participants.user = :ownerId AND participants.adder = :userTargetId',
      { userTargetId: userTargetId, ownerId: ownerId }
    );

  const [conversations, count] = await query.getManyAndCount();

  conversations.map(async (conversation) => {
    const subquery = await conversationRepository.createQueryBuilder('c');
    subquery
      .leftJoinAndSelect('c.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'users')
      .where('c.id = :conversationId', { conversationId: conversation.id });
    const quantity = await subquery.getOne();
    console.log(quantity);
  });

  return {
    conversations,
    count,
  };
};
