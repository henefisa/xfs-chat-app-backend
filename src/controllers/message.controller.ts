import { RequestWithBody } from 'src/shares';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as messageService from 'src/services/message.service';
import { User } from 'src/entities/user.entity';
import { deleteMessageDto } from 'src/dto/message/delete-messages.dto';

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
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req.user as User;
    const messages = await messageService.getMessages(
      req.params.id,
      reqUser.id,
      req.query
    );
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
};
