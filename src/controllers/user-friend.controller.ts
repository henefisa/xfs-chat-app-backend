import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messages, RequestWithBody } from 'src/shares';
import * as userFriendService from 'src/services/user-friend.service';
import * as userService from 'src/services/user.service';
import { User } from 'src/entities/user.entity';
import { FriendRequestDto } from 'src/dto/friend';
import { FriendActionDto } from 'src/dto/friend/friend-actions-request.dto';

export const sendFriendRequest = async (
  req: RequestWithBody<FriendRequestDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const reqUser = req.user as User;

    const friend = await userFriendService.friendRequest(reqUser.id, req.body);
    return res.status(StatusCodes.OK).json(friend);
  } catch (error) {
    next(error);
  }
};

export const getListRequest = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const reqUser = req.user as User;

    const { friends, count } = await userFriendService.getListRequest(
      reqUser.id,
      req.query
    );
    return res.status(StatusCodes.OK).json({
      friends,
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const getListSendRequest = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const reqUser = req.user as User;

    const { friends, count } = await userFriendService.getListSendRequest(
      reqUser.id,
      req.query
    );
    return res.status(StatusCodes.OK).json({
      friends,
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const getListFriends = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const reqUser = req.user as User;

    const friends = await userService.getListFriends(reqUser.id, req.query);
    return res.status(StatusCodes.OK).json(friends);
  } catch (error) {
    next(error);
  }
};

export const approveFriendRequest = async (
  req: RequestWithBody<FriendActionDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    if (!req.user) {
      return null;
    }

    const reqUser = req.user as User;

    await userFriendService.approveFriendRequest(req.body, reqUser.id);

    return res.status(StatusCodes.OK).json(messages.Accepted);
  } catch (error) {
    next(error);
  }
};

export const cancelFriendRequest = async (
  req: RequestWithBody<FriendActionDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    if (!req.user) {
      return null;
    }

    const reqUser = req.user as User;

    await userFriendService.cancelFriendRequest(req.body, reqUser.id);

    return res.status(StatusCodes.OK).json(messages.Cancelled);
  } catch (error) {
    next(error);
  }
};

export const cancelRequestToUser = async (
  req: RequestWithBody<FriendActionDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    if (!req.user) {
      return null;
    }

    const reqUser = req.user as User;

    await userFriendService.cancelRequestToUser(req.body, reqUser.id);

    return res.status(StatusCodes.OK).json(messages.Cancelled);
  } catch (error) {
    next(error);
  }
};
