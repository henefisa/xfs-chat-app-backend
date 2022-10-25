import { EUserFriend } from 'src/interfaces/user-friend.interface';
import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('userFriend')
export class UserFriend extends BaseEntity {
  @Column()
  owner: string;

  @Column({ enum: EUserFriend, default: EUserFriend.REQUESTED })
  status: EUserFriend;

  @ManyToOne(() => User, (users) => users.friends)
  users: User;
}
