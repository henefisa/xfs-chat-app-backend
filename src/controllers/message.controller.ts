import { RequestWithBody } from 'src/shares';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as messageService from 'src/services/message.service';
import { sendMessageDto } from 'src/dto/message/send-message.dto';
import { User } from 'src/entities/user.entity';
import { deleteMessageDto } from 'src/dto/message/delete-messages.dto';
import { getMessagesDto } from 'src/dto/message/get-messages.dto';

export const sendMessage = async (
  req: RequestWithBody<sendMessageDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const reqUser = req.user as User;

    const saved = await messageService.createMessage(req.body, reqUser.id);

    return res.status(StatusCodes.CREATED).json(saved);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: RequestWithBody<deleteMessageDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req.user as User;

    await messageService.deleteMessage(req.body, reqUser.id);

    return res.status(StatusCodes.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

export const deleteUserSideMessage = async (
  req: RequestWithBody<deleteMessageDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req.user as User;

    await messageService.hideMessage(req.body, reqUser.id);

    return res.status(StatusCodes.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: RequestWithBody<getMessagesDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req.user as User;
    const messages = await messageService.getMessages(
      req.params.id,
      reqUser.id
    );
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
};
