import { Message } from 'src/entities/message.entity';
import { GetOptions } from 'src/shares/get-options';

export enum ENotificationType {
  FriendRequest = 'FRIEND_REQUEST',
  FriendApprove = 'FRIEND_APPROVE',
  FriendCancel = 'FRIEND_CANCEL',
}

export enum ENotificationStatus {
  Seen = 'SEEN',
  NotSeen = 'NOT_SEEN',
}

export type GetMessageOptions = GetOptions<Message>;
