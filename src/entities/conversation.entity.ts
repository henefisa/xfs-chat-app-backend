import { Participants } from './participants.entity';
import { BaseEntity } from '../shares';
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ nullable: true })
  title: string;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => Participants, (participants) => participants.conversation)
  participants: Participants[];

  @Column({ default: false, name: 'is_group' })
  isGroup: boolean;
}
