import { BaseEntity } from '../shares';
import { Entity, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';

@Entity('participants')
export class Participants extends BaseEntity {
  @ManyToOne(() => Conversation, (conversation) => conversation.participants)
  conversation: Conversation;

  @ManyToOne(() => User)
  member: User;
}
