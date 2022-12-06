import {
  ENotificationType,
  ENotificationStatus,
} from './../interfaces/notification.interface';
import { BaseEntity } from 'src/shares';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('notification')
export class Notification extends BaseEntity {
  @Column({ enum: ENotificationStatus, default: ENotificationStatus.NotSeen })
  status: ENotificationStatus;

  @Column({ enum: ENotificationType, default: ENotificationType.FriendRequest })
  type: ENotificationType;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  recipient: User;
}
