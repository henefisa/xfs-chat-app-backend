import { NextFunction, Request, Response } from 'express';
import { User } from 'src/entities';
import { ForbiddenException, NotFoundException } from 'src/exceptions';
import { EGroupRole } from 'src/interfaces';
import * as participantService from 'src/services/participants.service';
import { Equal } from 'typeorm';

export default async function adminGroupMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as User;

    const participant = await participantService.getOne({
      where: {
        conversation: Equal(req.params.id),
        user: Equal(user.id),
      },
    });

    if (!participant) {
      throw new NotFoundException('participant');
    }

    if (participant.role !== EGroupRole.ADMIN) {
      throw new ForbiddenException();
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
