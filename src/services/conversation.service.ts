import { GetConversationOptions } from 'src/interfaces/conversation.interface';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { GetConversationDto } from 'src/dto/conversation/get-conversation.dto';
import Database from 'src/configs/Database';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { FindOneOptions } from 'typeorm';
import { checkMemberExist } from './participants.service';
import { Participants } from 'src/entities/participants.entity';
import { ExistsException, NotFoundException } from 'src/exceptions';
import { UpdateConversationDto } from 'src/dto/conversation/update-conversation.dto';
import { EGroupRole } from 'src/interfaces/user.interface';

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
    const currentConversation = await checkCoupleConversationExists(
      dto.members
    );

    if (currentConversation) {
      return currentConversation;
    }

    const newConversation = new Conversation();

    const request = {
      ...dto,
      isGroup: dto.members.length > 2 ? true : false,
    };

    Object.assign(newConversation, request);

    const conversation = await queryRunner.manager
      .withRepository(conversationRepository)
      .save(newConversation);

    if (!dto.members.includes(userId)) {
      throw new NotFoundException('user');
    }

    const promise = dto.members.map(async (member) => {
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

      if (member === userId && conversation.isGroup) {
        participant.role = EGroupRole.ADMIN;
      }

      await queryRunner.manager
        .withRepository(participantRepository)
        .save(participant);
      return participant;
    });

    await Promise.all(promise);

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

  query.orderBy('conversation.createdAt', 'DESC');

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

export const updateConversation = async (
  dto: UpdateConversationDto,
  conversationId: string,
  userId: string
) => {
  const conversation = await getOne({ where: { id: conversationId } });

  if (!conversation) {
    throw new NotFoundException('conversation');
  }

  const check = await checkMemberExist(conversationId, userId);

  if (!check) {
    throw new NotFoundException('member');
  }

  Object.assign(conversation, dto);

  return conversationRepository.save(conversation);
};

export const checkCoupleConversationExists = async (members: string[]) => {
  if (members.length > 2) {
    return false;
  }
  const query = await conversationRepository.createQueryBuilder('c');
  query
    .leftJoinAndSelect('c.participants', 'participants')
    .where(
      'participants.user = :userTargetId AND participants.adder = :ownerId',
      {
        userTargetId: members[0],
        ownerId: members[1],
      }
    )
    .orWhere(
      'participants.user = :ownerId AND participants.adder = :userTargetId',
      {
        userTargetId: members[0],
        ownerId: members[1],
      }
    )
    .andWhere('c.isGroup = false');
  const conversation = await query.getOne();
  if (!conversation) {
    return false;
  }

  return conversation;
};
