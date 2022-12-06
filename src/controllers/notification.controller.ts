import { SaveNotificationDto } from 'src/dto/notification/save-notification.dto';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/entities/user.entity';
import { Response, NextFunction } from 'express';
import { RequestWithBody } from 'src/shares/request-with-body';
import * as notificationServices from 'src/services/notification.service';

export const saveNotification = async (
  req: RequestWithBody<SaveNotificationDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    const saved = await notificationServices.saveNotification(
      user.id,
      req.body
    );

    return res.status(StatusCodes.OK).json(saved);
  } catch (error) {
    next(error);
  }
};
