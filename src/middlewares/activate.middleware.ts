import { NextFunction, Request, Response } from 'express';
import { ForbiddenException, UnauthorizedException } from 'src/exceptions';
import { EUserActiveStatus } from 'src/interfaces/user.interface';
import { getOne } from 'src/services/user.service';
import { verifyToken } from './check-roles.middleware';

export default async function activateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = verifyToken(req);
    const user = await getOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      [
        EUserActiveStatus.Deactivate,
        EUserActiveStatus.Inactive,
        EUserActiveStatus.Banned,
      ].includes(user.activeStatus)
    ) {
      throw new ForbiddenException();
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
