import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from 'src/exceptions';
import { config } from 'dotenv';
import { getOne } from 'src/services/user.service';
import { message } from 'src/shares';

config();

export const verifyToken = (req: Request) => {
  const token = <string>req.headers['auth'];
  if (!token) {
    throw new UnauthorizedException();
  }
  let jwtPayload;
  try {
    return (jwtPayload = <any>(
      jwt.verify(token, process.env.SECRET || 'anything')
    ));
  } catch (error) {
    throw new UnauthorizedException();
  }
};

export default async function verifyAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const Payload = verifyToken(req);
  const user = await getOne({ where: { id: Payload.id } });
  if (!user) {
    throw new UnauthorizedException();
  }
  if (user.role === 'ADMIN') next();
  else {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(message.NOT_ACCEPTABLE);
  }
}
