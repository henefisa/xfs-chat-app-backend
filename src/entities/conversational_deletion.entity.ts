import { User } from 'src/entities/user.entity';
import { Conversation } from 'src/entities';
import { BaseEntity } from '../shares';
import { Entity, ManyToOne } from 'typeorm';

@Entity('conversational_deletion')
export class ConversationalDeletion extends BaseEntity {
  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;
}
