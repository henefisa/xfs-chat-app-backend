import { CheckConversationDto } from 'src/dto/conversation/check-conversation.dto';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestWithBody } from 'src/shares';
import * as conversationService from 'src/services/conversation.service';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { User } from 'src/entities/user.entity';
import { UpdateConversationDto } from 'src/dto/conversation/update-conversation.dto';

export const createConversation = async (
  req: RequestWithBody<CreateConversationDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    const newConversation = await conversationService.createConversation(
      req.body,
      user.id
    );
    return res.status(StatusCodes.CREATED).json(newConversation);
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

export const getConversations = async (
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

export const checkConversationOfTwoMember = async (
  req: RequestWithBody<CheckConversationDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req.user as User;
    const conversation = await conversationService.checkConversationOfTwoMember(
      req.body,
      reqUser.id
    );
    return res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (
  req: RequestWithBody<UpdateConversationDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    const updated = await conversationService.updateConversation(
      req.body,
      req.params.id,
      user.id
    );

    return res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

export const archiveConversation = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    const archived = await conversationService.archive(user.id, req.params.id);

    return res.status(StatusCodes.OK).json(archived);
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;

    const conversationDeletion = await conversationService.deleteConversation(
      req.params.id,
      user.id
    );

    return res.status(StatusCodes.OK).json(conversationDeletion);
  } catch (error) {
    next(error);
  }
};
