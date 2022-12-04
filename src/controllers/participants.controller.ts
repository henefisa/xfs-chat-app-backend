import { NextFunction, Response, Request } from 'express';
import { AddParticipantDto } from 'src/dto/participant/add-participant.dto';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/entities/user.entity';
import * as participantServices from 'src/services/participants.service';
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

export const getParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req.user as User;
    const { participants, count } = await participantServices.getParticipants(
      req.params.id,
      reqUser.id
    );
    return res.status(StatusCodes.OK).json({ participants, count });
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
