import { NotExistException } from './../exceptions/not-found.exception';
import Database from 'src/configs/Database';
import { addParticipantDto } from 'src/dto/participant/add-participant.dto';
import { Participants } from 'src/entities/participants.entity';
import { FindOneOptions, Equal } from 'typeorm';

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
