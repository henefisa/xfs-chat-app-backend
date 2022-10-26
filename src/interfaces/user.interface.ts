import { User } from 'src/entities/user.entity';
import { GetOptions } from 'src/shares/get-options';

export enum EUserStatus {
	Active = 'ACTIVE',
	Inactive = 'INACTIVE',
	Banned = 'BANNED',
}

export enum EUserRole {
	OWNER = 'OWNER',
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	USER = 'USER',
}

export type GetUserOptions = GetOptions<User>;
