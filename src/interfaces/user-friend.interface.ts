import { UserFriend } from 'src/entities/user-friend.entity';
import { GetOptions } from 'src/shares/get-options';

export enum EUserFriendRequestStatus {
	REQUESTED = 'REQUESTED',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED',
}

export type GetUserFriendsOptions = GetOptions<UserFriend>;
