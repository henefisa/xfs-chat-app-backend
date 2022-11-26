import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestWithBody } from 'src/shares';
import * as conversationService from 'src/services/conversation.service';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { User } from 'src/entities/user.entity';

export const createConversation = async (
  req: RequestWithBody<CreateConversationDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const newConversation = await conversationService.createConversation(
      req.body
    );
    return res.status(StatusCodes.OK).json(newConversation);
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const conversation = await conversationService.getOne({
      where: { id: req.params.id },
    });
    return res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const GetConversations = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    const { conversations, count } =
      await conversationService.getConversationsOfUser(user.id, req.query);

    return res.status(StatusCodes.OK).json({ conversations, count });
  } catch (error) {
    next(error);
  }
};

export const GetGroups = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    const conversations = await conversationService.getGroups(
      user.id,
      req.query
    );
    return res.status(StatusCodes.OK).json(conversations);
  } catch (error) {
    next(error);
  }
};
