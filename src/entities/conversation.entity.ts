// import { Participants } from './participants.entity';
import { BaseEntity } from '../shares';
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column()
  title: string;

  @OneToMany(() => Message, (messages) => messages.conversation)
  messages: Message[];

  // @OneToMany(() => Participants, (participants) => participants.conversation)
  // participants: Participants[];
}
