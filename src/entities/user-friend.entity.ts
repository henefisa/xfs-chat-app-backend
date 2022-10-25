import { EUserFriendRequestStatus } from 'src/interfaces/user-friend.interface';
import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('user_friends')
export class UserFriend extends BaseEntity {
  @Column()
  owner: string;

  @Column({
    enum: EUserFriendRequestStatus,
    default: EUserFriendRequestStatus.REQUESTED,
  })
  status: EUserFriendRequestStatus;

  @ManyToOne(() => User, (users) => users.friends)
  user: User;
}
