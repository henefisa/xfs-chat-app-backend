import Database from 'src/configs/Database';
import { addParticipantDto } from 'src/dto/participant/add-participant.dto';
import { Participants } from 'src/entities/participants.entity';
import { FindOneOptions } from 'typeorm';

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
