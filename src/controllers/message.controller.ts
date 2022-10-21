import { GetMessageDto } from 'src/dto/message/get-message.dto';
import { RequestWithBody } from 'src/shares';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as messageService from 'src/services/message.service';
import { sendMessageDto } from 'src/dto/message/send-message.dto';

export const sendMessages = async (
  req: RequestWithBody<sendMessageDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    req.headers['set-cookie']?.values;
    res.setHeader('Content-Type', 'application/json');
    const saved = await messageService.createMessage(req.body);
    return res.status(StatusCodes.CREATED).json(saved);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: RequestWithBody<GetMessageDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const { messages, count } = await messageService.getMessages(
      req.params.conversationId,
      req.body
    );
    return res.status(StatusCodes.OK).json({
      messages,
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    await messageService.deleteMessage(req.params.id);
    return res.status(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};
