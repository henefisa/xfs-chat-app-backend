import { EUserRole } from 'src/interfaces/user.interface';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shares';
import { EUserStatus } from 'src/interfaces/user.interface';
import { FriendRequest } from './friend-request.entity';
import { FriendWasRequested } from './friend-was-requested.entity';
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

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ enum: EUserStatus, default: EUserStatus.Inactive })
  status: EUserStatus;

  @Column({ enum: EUserRole, default: EUserRole.USER })
  role: EUserRole;

  @OneToMany(() => FriendRequest, (friend) => friend.userTarget)
  friendRequest: FriendRequest[];

  @OneToMany(() => FriendWasRequested, (friend) => friend.owner)
  friendWasRequested: FriendWasRequested[];
}
