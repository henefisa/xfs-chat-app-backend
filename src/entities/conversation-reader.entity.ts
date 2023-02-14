import { Conversation, User } from 'src/entities';
import { BaseEntity } from 'src/shares';
import { Entity, ManyToOne } from 'typeorm';

@Entity('conversation_readers')
export class ConversationReader extends BaseEntity {
  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;
}
