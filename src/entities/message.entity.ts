import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Conversation } from './conversation.entity';
import { MessageHided } from './message-hided.entity';
import { User } from './user.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  attachment: string;

  @Column({ default: false, name: 'is_pin' })
  isPin: boolean;

  @Column({ default: false, name: 'is_tick' })
  isTick: boolean;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @OneToMany(() => MessageHided, (messageHided) => messageHided.message)
  messageHided: MessageHided[];
}
