import { IAuthentication } from './../interfaces/auth.interface';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException, NotAcceptableException } from 'src/exceptions';
import { config } from 'dotenv';
import { getOne } from 'src/services/user.service';

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
  const Payload = verifyToken(req);
  const user = await getOne({ where: { id: Payload.id } });
  if (!user) {
    throw new UnauthorizedException();
  }
  if (user.role !== 'ADMIN') {
    throw new NotAcceptableException();
  }
  return next();
}
