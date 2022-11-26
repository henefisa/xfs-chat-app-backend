import { BaseEntity } from '../shares';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';
import { EGroupRole } from 'src/interfaces/user.interface';

@Entity('participants')
export class Participants extends BaseEntity {
  @Column({ enum: EGroupRole, default: EGroupRole.MEMBER })
  role: EGroupRole;

  @ManyToOne(() => Conversation, (conversation) => conversation.participants)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  adder: User;
}
