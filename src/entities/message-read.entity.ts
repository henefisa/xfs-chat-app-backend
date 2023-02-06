import { Conversation, User } from 'src/entities';
import { BaseEntity } from 'src/shares';
import { Entity, ManyToOne } from 'typeorm';

@Entity('message_read')
export class MessageRead extends BaseEntity {
  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;
}
