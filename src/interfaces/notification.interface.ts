import { Notification } from 'src/entities/notification.entity';
import { GetOptions } from 'src/shares/get-options';

export enum ENotificationType {
  FriendRequest = 'FRIEND_REQUEST',
  FriendApprove = 'FRIEND_APPROVE',
}

export type GetNotificationType = GetOptions<Notification>;
