import Database from 'src/configs/Database';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { FindOneOptions } from 'typeorm';

const conversationRepository = Database.instance
  .getDataSource('default')
  .getRepository(Conversation);

export const createConversation = async (dto: CreateConversationDto) => {
  const newConversation = new Conversation();

  Object.assign(newConversation, dto);

  return conversationRepository.save(newConversation);
};

export const getOne = async (options: FindOneOptions<Conversation>) => {
  return conversationRepository.findOne(options);
};
