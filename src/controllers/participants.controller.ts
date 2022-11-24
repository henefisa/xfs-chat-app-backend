import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/entities/user.entity';
import * as participantServices from 'src/services/participants.service';

export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const reqUser = req.user as User;
    const added = await participantServices.addMember(
      req.body,
      req.params.id,
      reqUser.id
    );
    return res.status(StatusCodes.CREATED).json(added);
  } catch (error) {
    next(error);
  }
};
