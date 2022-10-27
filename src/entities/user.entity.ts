import { EUserRole } from 'src/interfaces/user.interface';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shares';
import { EUserStatus } from 'src/interfaces/user.interface';
import { Message } from './message.entity';
import { UserFriend } from './user-friend.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ enum: EUserStatus, default: EUserStatus.Inactive })
  status: EUserStatus;

  @Column({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;

  @OneToMany(() => Message, (messages) => messages.owner)
  messages: Message[];

  @OneToMany(() => UserFriend, (UserFriends) => UserFriends.owner)
  friends: UserFriend[];
}
