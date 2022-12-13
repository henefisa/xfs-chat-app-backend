import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateUserDto } from 'src/dto/user';
import { RequestWithBody } from 'src/shares';
import * as userService from 'src/services/user.service';
import * as messageService from 'src/services/message.service';
import * as conversationSevice from 'src/services/conversation.service';
import { AdminUpdateRoleUserDto } from 'src/dto/admin';

export const createUser = async (
  req: RequestWithBody<CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await userService.createUser(req.body);
    return res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateRoleUser = async (
  req: RequestWithBody<AdminUpdateRoleUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const updated = await userService.updateRoleUser(req.params.id, req.body);
    return res.status(StatusCodes.CREATED).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await userService.getOne({
      where: { id: req.params.id },
    });
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const { users, count } = await userService.getAllUsers(req.query);

    return res.status(StatusCodes.OK).json({ users, count });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const banned = await userService.banUser(req.params.id);

    return res.status(StatusCodes.OK).json(banned);
  } catch (error) {
    next(error);
  }
};

export const unbannedUser = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const banned = await userService.unbannedUser(req.params.id);

    return res.status(StatusCodes.OK).json(banned);
  } catch (error) {
    next(error);
  }
};

export const userStatistics = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const countMessages = await messageService.countMessagesOfUser(
      req.params.id,
      req.query
    );
    const countConversation = await conversationSevice.countConversationsOfUser(
      req.params.id
    );

    return res
      .status(StatusCodes.OK)
      .json({ countMessages, countConversation });
  } catch (error) {
    next(error);
  }
};
