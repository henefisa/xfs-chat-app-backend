import { Participants } from './participants.entity';
import { BaseEntity } from '../shares';
import { Column, Entity, IsNull, OneToMany } from 'typeorm';
import { Message } from './message.entity';


@Entity('users')
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @OneToMany(() => Message, (messages) => messages.owner)
  messages: Message[];

  @OneToMany(() => Participants, (participants) => participants.owner)
  participants: Participants[];
}
