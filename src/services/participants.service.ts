import Database from 'src/configs/Database';
import { addParticipantDto } from 'src/dto/participant/add-participant.dto';
import { SetAdminDto } from 'src/dto/participant/set-admin.dto';
import { Participants } from 'src/entities/participants.entity';
import { NotFoundException } from 'src/exceptions';
import { EGroupRole } from 'src/interfaces/user.interface';
import { Equal, FindOneOptions } from 'typeorm';

const participantRepository = Database.instance
  .getDataSource('default')
  .getRepository(Participants);

export const addMember = async (
  dto: addParticipantDto,
  conversationId: string,
  adderId: string
) => {
  const participant = new Participants();
  const request = {
    conversation: conversationId,
    user: dto.userTarget,
    adder: adderId,
  };

  Object.assign(participant, request);
  return participantRepository.save(participant);
};

export const checkMemberExist = async (
  conversationId: string,
  userId: string
) => {
  const query = await participantRepository.createQueryBuilder('p');
  query
    .where('p.conversation = :conversationId', {
      conversationId: conversationId,
    })
    .andWhere('p.user = :userId OR p.adder = :userId', { userId: userId });
  const participants = await query.getOne();

  if (!participants) {
    return false;
  }

  return true;
};

export const getOne = async (options: FindOneOptions<Participants>) => {
  return participantRepository.findOne(options);
};

export const setGroupAdmin = async (
  dto: SetAdminDto,
  conversationId: string
) => {
  const participant = await getOne({
    where: { user: Equal(dto.userId), conversation: Equal(conversationId) },
  });

  if (!participant) {
    throw new NotFoundException('participant');
  }

  participant.role = EGroupRole.ADMIN;

  return participantRepository.save(participant);
};
