import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  attachment: string;

  @Column({ default: false })
  isPin: boolean;

  @Column({ default: false })
  isTick: boolean;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Conversation)
  conversation: Conversation;
}
