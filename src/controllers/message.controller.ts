import { RequestWithBody } from 'src/shares';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as messageService from 'src/services/message.service';
import { sendMessageDto } from 'src/dto/message/send-message.dto';
import { User } from 'src/entities/user.entity';

export const sendMessages = async (
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
