import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GetUserFriendDto, FriendRequestDto } from 'src/dto/user';
import { RequestWithBody } from 'src/shares';
import * as userFriendService from 'src/services/user-friend.service';
import { EUserFriend } from 'src/interfaces/user-friend.interface';

export const FriendRequestSend = async (
  req: RequestWithBody<FriendRequestDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const friend = await userFriendService.friendRequest(req.body);
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
    const { friends, count } = await userFriendService.getFriends(
      EUserFriend.REQUESTED,
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

export const getFriends = async (
  req: RequestWithBody<GetUserFriendDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const { friends, count } = await userFriendService.getFriends(
      EUserFriend.FRIEND,
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
