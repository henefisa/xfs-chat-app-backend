import Database from 'src/configs/Database';
import {
  AddParticipantDto,
  DeleteParticipantDto,
  SetAdminDto,
} from 'src/dto/participant';
import { Participants } from 'src/entities/participants.entity';
import {
  NotFoundException,
  ExistsException,
  NotExistException,
  ForbiddenException,
} from 'src/exceptions';
import { EGroupRole } from 'src/interfaces/user.interface';
import { Equal, FindOneOptions } from 'typeorm';
import * as conversationService from 'src/services/conversation.service';

const participantRepository = Database.instance
  .getDataSource('default')
  .getRepository(Participants);

export const addMember = async (
  dto: AddParticipantDto,
  conversationId: string,
  adderId: string
) => {
  const conversation = await conversationService.getOne({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new NotFoundException('conversation');
  }

  if (!conversation.isGroup) {
    throw new ForbiddenException();
  }

  const participants = dto.members.map(async (member) => {
    const checked = await checkMemberExist(conversationId, member);
    if (checked) {
      throw new ExistsException('member');
    }
    const participant = new Participants();
    const request = {
      conversation: conversationId,
      user: member,
      adder: adderId,
    };
    Object.assign(participant, request);
    await participantRepository.save(participant);
    return participant;
  });
  const p = await Promise.all(participants);

  return p;
};

export const checkMemberExist = async (
  conversationId: string,
  userId: string
) => {
  const participant = await getOne({
    where: {
      conversation: Equal(conversationId),
      user: Equal(userId),
    },
  });

  if (!participant) {
    return false;
  }

  return true;
};

export const getOne = async (options: FindOneOptions<Participants>) => {
  return participantRepository.findOne(options);
};

export const getParticipants = async (
  conversationId: string,
  userId: string
) => {
  const checked = await checkMemberExist(conversationId, userId);

  if (!checked) {
    throw new NotExistException('member');
  }

  const query = await participantRepository
    .createQueryBuilder('p')
    .leftJoinAndSelect('p.user', 'users')
    .where('p.conversation = :conversationId', {
      conversationId: conversationId,
    });

  const [participants, count] = await query.getManyAndCount();

  return {
    participants,
    count,
  };
};

export const setGroupAdmin = async (
  dto: SetAdminDto,
  conversationId: string
) => {
  const participant = await getOne({
    where: { user: Equal(dto.userId), conversation: Equal(conversationId) },
  });

  const conversation = await conversationService.getOne({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new NotFoundException('conversation');
  }

  if (!participant) {
    throw new NotFoundException('participant');
  }

  if (!conversation.isGroup) {
    throw new ForbiddenException();
  }

  participant.role = EGroupRole.ADMIN;

  return participantRepository.save(participant);
};

export const deleteParticipant = async (
  dto: DeleteParticipantDto,
  conversationId: string
) => {
  const participant = await getOne({
    where: { user: Equal(dto.userId), conversation: Equal(conversationId) },
  });

  if (!participant) {
    throw new NotFoundException('participant');
  }

  return participantRepository.delete(participant.id);
};
