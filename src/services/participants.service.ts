import { AddParticipantDto } from './../dto/participant/add-participant.dto';
import Database from 'src/configs/Database';
import { Participants } from 'src/entities/participants.entity';
import { Equal, FindOneOptions } from 'typeorm';

const participantRepository = Database.instance
  .getDataSource('default')
  .getRepository(Participants);

export const addMember = async (
  dto: AddParticipantDto,
  conversationId: string,
  adderId: string
) => {
  const participants: Array<Participants> = [];

  dto.members.forEach((member) => {
    const participant = new Participants();
    const request = {
      conversation: conversationId,
      user: member.userTarget,
      adder: adderId,
    };
    Object.assign(participant, request);
    participantRepository.save(participant);
    participants.push(participant);
  });

  return participants;
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
