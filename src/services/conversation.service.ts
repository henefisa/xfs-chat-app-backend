import { GetConversationOptions } from 'src/interfaces/conversation.interface';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { GetConversationDto } from 'src/dto/conversation/get-conversation.dto';
import Database from 'src/configs/Database';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { FindOneOptions } from 'typeorm';
import { checkMemberExist } from './participants.service';
import { Participants } from 'src/entities/participants.entity';
import { ExistsException } from 'src/exceptions';

const conversationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Conversation);

const participantRepository = Database.instance
  .getDataSource('default')
  .getRepository(Participants);

const dataSource = Database.instance.getDataSource('default');
export const createConversation = async (
  dto: CreateConversationDto,
  userId: string
) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.startTransaction();

  try {
    const newConversation = new Conversation();

    Object.assign(newConversation, dto);

    const conversation = await queryRunner.manager
      .withRepository(conversationRepository)
      .save(newConversation);

    dto.members.forEach(async (member) => {
      const checked = await checkMemberExist(conversation.id, member);
      if (checked) {
        throw new ExistsException('member');
      }
      const participant = new Participants();
      const request = {
        conversation: conversation.id,
        user: member,
        adder: userId,
      };
      Object.assign(participant, request);
      await queryRunner.manager
        .withRepository(participantRepository)
        .save(participant);
    });

    await queryRunner.commitTransaction();
    return conversation;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  }
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
    .leftJoinAndSelect('conversation.participants', 'participants')
    .leftJoinAndSelect('participants.user', 'users')
    .where(
      'conversation.id IN' +
        query
          .subQuery()
          .select('p.conversationId')
          .from(Participants, 'p')
          .where('p.userId = :userId')
          .getQuery()
    )
    .setParameter('userId', userId);

  if (dto?.q) {
    query.andWhere(
      '(title ILIKE :q  OR username ILIKE :q OR full_name ILIKE :q)',
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
