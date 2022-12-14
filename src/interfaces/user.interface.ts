import { User } from 'src/entities/user.entity';
import { GetOptions } from 'src/shares/get-options';

export enum EUserActiveStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Deactivate = 'DEACTIVATE',
  Banned = 'BANNED',
}

export enum EUserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export enum EUserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
}

export enum EGroupRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export type GetUserOptions = GetOptions<User>;
