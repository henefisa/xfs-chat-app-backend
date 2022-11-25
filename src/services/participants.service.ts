import { AddParticipantDto } from './../dto/participant/add-participant.dto';
import Database from 'src/configs/Database';
import { Participants } from 'src/entities/participants.entity';
import { Equal, FindOneOptions } from 'typeorm';
import { ExistsException } from 'src/exceptions';

const participantRepository = Database.instance
  .getDataSource('default')
  .getRepository(Participants);

export const addMember = async (
  dto: AddParticipantDto,
  conversationId: string,
  adderId: string
) => {
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
