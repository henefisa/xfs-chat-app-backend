import { AddParticipantDto } from './../dto/participant/add-participant.dto';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/entities/user.entity';
import * as participantServices from 'src/services/participants.service';
import { addParticipantDto } from 'src/dto/participant/add-participant.dto';
import { SetAdminDto } from 'src/dto/participant/set-admin.dto';
import { RequestWithBody } from 'src/shares';

export const addMember = async (
  req: RequestWithBody<AddParticipantDto>,
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

export const setAdmin = async (
  req: RequestWithBody<SetAdminDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const added = await participantServices.setGroupAdmin(
      req.body,
      req.params.id
    );
    return res.status(StatusCodes.CREATED).json(added);
  } catch (error) {
    next(error);
  }
};
