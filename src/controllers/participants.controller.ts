import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/entities/user.entity';
import { RequestWithBody } from 'src/shares';
import * as participantServices from 'src/services/participants.service';
import { addParticipantDto } from 'src/dto/participant/add-participant.dto';

export const addMember = async (
  req: RequestWithBody<addParticipantDto>,
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
    return res.status(StatusCodes.CREATED).json({ participants, count });
  } catch (error) {
    next(error);
  }
};
