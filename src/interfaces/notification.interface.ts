import { Notification } from 'src/entities/notification.entity';
import { GetOptions } from 'src/shares/get-options';

export enum ENotificationType {
  FriendRequest = 'FRIEND_REQUEST',
  CancelOrAcceptFriendRequest = 'CANCEL_OR_ACCEPT_FRIEND_REQUEST',
  WarningBan = 'WARNING_BAN',
  Banned = 'BANNED',
  Unbanned = 'UNBANNED',
  UserActive = 'USER_ACTIVE',
  UserDeActive = 'USER_DEACTIVE',
  OutGroup = 'OUT_GROUP',
  ChangeAvatarGroup = 'CHANGE_AVATAR_GROUP',
  ChangeAvatarUser = 'CHANGE_AVATAR_USER',
  MissedCall = 'MISSED_CALL',
  MessagesFromStrangers = 'MESSAGES_FROM_STRANGERS',
}

export type GetNotificationType = GetOptions<Notification>;
