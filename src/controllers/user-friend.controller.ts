import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestWithBody } from 'src/shares';
import * as userFriendService from 'src/services/user-friend.service';
import { User } from 'src/entities/user.entity';
import { FriendRequestDto, GetUserFriendDto } from 'src/dto/friend';

export const sendFriendRequest = async (
	req: RequestWithBody<FriendRequestDto>,
	res: Response,
	next: NextFunction
) => {
	try {
		res.setHeader('Content-Type', 'application/json');

		if (!req.user) {
			return null;
		}

		const reqUser = req.user as User;

		const friend = await userFriendService.friendRequest(reqUser.id, req.body);
		return res.status(StatusCodes.OK).json(friend);
	} catch (error) {
		next(error);
	}
};

export const getFriendsRequest = async (
	req: RequestWithBody<GetUserFriendDto>,
	res: Response,
	next: NextFunction
) => {
	try {
		res.setHeader('Content-Type', 'application/json');

		if (!req.user) {
			return null;
		}

		const reqUser = req.user as User;

		const { friends, count } = await userFriendService.getFriends(
			reqUser.id,
			req.body
		);
		return res.status(StatusCodes.OK).json({
			friends,
			count,
		});
	} catch (error) {
		next(error);
	}
};
