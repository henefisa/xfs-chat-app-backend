import { GetConversationOptions } from 'src/interfaces/conversation.interface';
import { getLimitAndOffset } from 'src/shares/get-limit-and-offset';
import { GetConversationDto } from 'src/dto/conversation/get-conversation.dto';
import Database from 'src/configs/Database';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { FindOneOptions, Equal } from 'typeorm';
import { checkMemberExist } from './participants.service';
import { Participants } from 'src/entities/participants.entity';
import { ExistsException, NotFoundException } from 'src/exceptions';
import { CheckConversationDto } from 'src/dto/conversation/check-conversation.dto';
import { UpdateConversationDto } from 'src/dto/conversation/update-conversation.dto';
import { EGroupRole } from 'src/interfaces/user.interface';
import { ConversationArchive } from 'src/entities/conversation-archived.entity';
import moment from 'moment';
import * as transactionService from 'src/services/transaction.service';

const conversationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Conversation);

const participantRepository = Database.instance
  .getDataSource('default')
  .getRepository(Participants);

const conversationArchivedRepository = Database.instance
  .getDataSource('default')
  .getRepository(ConversationArchive);

export const createConversation = async (
  dto: CreateConversationDto,
  userId: string
) => {
  const queryRunner = await transactionService.startConnect();
  const currentConversation = await checkCoupleConversationExists(dto.members);

  if (currentConversation) {
    return currentConversation;
  }
  const newConversation = new Conversation();

  const request = {
    ...dto,
    isGroup: dto.members.length > 2 ? true : false,
  };
  Object.assign(newConversation, request);

  const conversation = await transactionService.save(
    conversationRepository,
    newConversation,
    queryRunner
  );

  if (!dto.members.includes(userId)) {
    throw new NotFoundException('user');
  }

  const promise = dto.members.map(async (member) => {
    const checked = await checkMemberExist(newConversation.id, member);
    if (checked) {
      throw new ExistsException('member');
    }
    const participant = new Participants();
    const request = {
      conversation: newConversation.id,
      user: member,
      adder: userId,
    };
    Object.assign(participant, request);

    if (member === userId && newConversation.isGroup) {
      participant.role = EGroupRole.ADMIN;
    }

    await transactionService.save(
      participantRepository,
      participant,
      queryRunner
    );
    return participant;
  });

  await Promise.all(promise);

  await transactionService.commitTransaction(queryRunner);
  return conversation;
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
    .andWhere(
      'conversation.id NOT IN' +
        query
          .subQuery()
          .select('archive.conversationId')
          .from(ConversationArchive, 'archive')
          .where('archive.userId = :userId')
          .andWhere('archive.isHided = true')
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
    .setParameter('userId', userId)
    .andWhere('conversation.is_group = true');

  if (dto?.q) {
    query.andWhere(
      '(title ILIKE :q  OR username ILIKE :q OR full_name ILIKE :q)',
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

export const checkConversationOfTwoMember = async (
  dto: CheckConversationDto,
  ownerId: string
) => {
  const query = await conversationRepository.createQueryBuilder('c');

  query
    .leftJoinAndSelect('c.participants', 'participants')
    .where(
      'participants.user = :userTargetId AND participants.adder = :ownerId',
      {
        userTargetId: dto.userTarget,
        ownerId: ownerId,
      }
    )
    .orWhere(
      'participants.user = :ownerId AND participants.adder = :userTargetId',
      {
        userTargetId: dto.userTarget,
        ownerId: ownerId,
      }
    )
    .andWhere('c.isGroup = false');

  const conversation = await query.getOne();

  if (!conversation) {
    return null;
  }

  return conversation;
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

export const countConversationsOfUser = async (userId: string) => {
  const query = conversationRepository
    .createQueryBuilder('conversation')
    .leftJoin(Participants, 'p', 'p.conversationId = conversation.id')
    .where('(p.userId = :userId AND p.adderId = :adder)')
    .orWhere('(p.adder = :userId AND p.userId = :adder)')
    .setParameters({ userId, adder: userId });
  return query.getCount();
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

export const archive = async (userId: string, conversationId: string) => {
  const conversationArchived = createObjectConversationArchived(
    userId,
    conversationId
  );
  return conversationArchivedRepository.save(conversationArchived);
};

export const getConversationArchived = async (
  options: FindOneOptions<ConversationArchive>
) => {
  return conversationArchivedRepository.findOne(options);
};

export const createObjectConversationArchived = (
  userId: string,
  conversationId: string
) => {
  const conversationArchived = new ConversationArchive();
  const request = {
    conversation: conversationId,
    user: userId,
  };
  Object.assign(conversationArchived, request);
  return conversationArchived;
};

export const deleteConversation = async (
  conversationId: string,
  userId: string
) => {
  let conversationArchived = await checkConversationArchive(
    conversationId,
    userId
  );

  if (!conversationArchived) {
    conversationArchived = createObjectConversationArchived(
      userId,
      conversationId
    );
  }

  conversationArchived.deleteAt = moment();

  return conversationArchivedRepository.save(conversationArchived);
};

export const checkConversationArchive = async (
  conversationId: string,
  userId: string
) => {
  const conversationArchived = await getConversationArchived({
    where: { conversation: Equal(conversationId), user: Equal(userId) },
  });

  if (!conversationArchived) {
    return false;
  }
  return conversationArchived;
};
