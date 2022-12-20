import { StatusCodes } from 'http-status-codes';
import { User } from 'src/entities/user.entity';
import { Response, NextFunction, Request } from 'express';
import { RequestWithBody } from 'src/shares/request-with-body';
import { expressFeelingDto } from 'src/dto/emoticon/express-feeling.dto';
import * as messageService from 'src/services/message.service';

export const expressFeeling = async (
  req: RequestWithBody<expressFeelingDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const reqUser = req.user as User;

    const expressed = await messageService.expressFeeling(req.body, reqUser.id);

    return res.status(StatusCodes.CREATED).json(expressed);
  } catch (error) {
    next(error);
  }
};

export const getEmotions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const emoticons = await messageService.getEmotions(req.params.id);

    return res.status(StatusCodes.OK).json(emoticons);
  } catch (error) {
    next(error);
  }
};
