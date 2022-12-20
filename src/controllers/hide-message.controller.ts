import { RequestWithBody } from 'src/shares';
import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as messageService from 'src/services/message.service';
import { User } from 'src/entities/user.entity';
import { hideMessageDto } from 'src/dto/message/hide-message.dto';

export const hideMessage = async (
  req: RequestWithBody<hideMessageDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const reqUser = req.user as User;

    const hide = await messageService.hideMessage(req.body, reqUser.id);

    return res.status(StatusCodes.CREATED).json(hide);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const reqUser = req.user as User;

    const hide = await messageService.createMessage(
      req.body.conversation,
      reqUser.id,
      req.body.text
    );

    return res.status(StatusCodes.CREATED).json(hide);
  } catch (error) {
    next(error);
  }
};
