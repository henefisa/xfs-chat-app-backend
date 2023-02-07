import { Conversation, User } from 'src/entities';
import { BaseEntity } from 'src/shares';
import { Entity, ManyToOne } from 'typeorm';

@Entity('users_viewed')
export class UsersViewed extends BaseEntity {
  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;
}
