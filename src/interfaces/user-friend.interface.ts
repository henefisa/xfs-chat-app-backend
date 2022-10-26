import { UserFriend } from 'src/entities/user-friend.entity';
import { GetOptions } from 'src/shares/get-options';

export enum EUserFriendRequestStatus {
	REQUESTED = 'REQUESTED',
	FRIEND = 'FRIEND',
	CANCEL = 'CANCEL',
}

export type GetUserFriendsOptions = GetOptions<UserFriend>;
