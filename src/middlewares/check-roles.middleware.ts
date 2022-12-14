import { IAuthentication } from 'src/interfaces/auth.interface';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ForbiddenException, UnauthorizedException } from 'src/exceptions';
import { config } from 'dotenv';
import { getOne } from 'src/services/user.service';
import { EUserRole } from 'src/interfaces/user.interface';

config();

export const verifyToken = (req: Request) => {
  const token = <string>req.headers['authorization'];

  if (!token) {
    throw new UnauthorizedException();
  }
  const str = token.split(' ')[1];
  try {
    return <IAuthentication>jwt.verify(str, process.env.SECRET || 'anything');
  } catch (error) {
    throw new UnauthorizedException();
  }
};

export default async function roleMiddleware(
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
    if (user.role !== EUserRole.ADMIN) {
      throw new ForbiddenException();
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
