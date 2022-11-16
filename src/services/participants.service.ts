import Database from 'src/configs/Database';
import { Participants } from 'src/entities/participants.entity';
import { ExistsException } from 'src/exceptions';
import { Equal, FindOneOptions } from 'typeorm';

const participantRepository = Database.instance
  .getDataSource('default')
  .getRepository(Participants);

export const addMember = async (conversation: string, member: string) => {
  const participant = new Participants();
  const request = {
    conversation: conversation,
    member: member,
  };
  Object.assign(participant, request);

  return participantRepository.save(participant);
};

export const checkMemberExist = async (
  conversation: string,
  member: string
) => {
  try {
    const participant = await getOne({
      where: {
        conversation: Equal(conversation),
        member: Equal(member),
      },
    });

    if (participant) {
      throw new ExistsException('member');
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const getOne = async (options: FindOneOptions<Participants>) => {
  return participantRepository.findOne(options);
};
