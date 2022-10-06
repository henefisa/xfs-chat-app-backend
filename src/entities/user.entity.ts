import { EUserRole } from './../interfaces/user.interface';
// import { Participants } from './participants.entity';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shares';
// import { Message } from './message.entity';

import { EUserStatus } from 'src/interfaces/user.interface';
@Entity('users')
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  full_name: string;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @Column({ enum: EUserStatus, default: EUserStatus.Inactive })
  status: EUserStatus;

  @Column({ enum: EUserRole, default: EUserRole.ADMIN })
  role: EUserRole;

  // @OneToMany(() => Message, (messages) => messages.owner)
  // messages: Message[];

  // @OneToMany(() => Participants, (participants) => participants.owner)
  // participants: Participants[];
}
