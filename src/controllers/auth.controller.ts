import { NotExistException } from './../exceptions/not-found.exception';
import { createToken, validateUser } from 'src/services/auth.service';
import { LoginDto } from 'src/dto/auth';
import { StatusCodes } from 'http-status-codes';
import { Response, NextFunction } from 'express';
import { RequestWithBody } from 'src/shares';
import { getOneOrThrow } from 'src/services/user.service';

export const login = async (
  req: RequestWithBody<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new NotExistException('user');
    }

    const u = await getOneOrThrow({
      where: { username: req.body.username },
    });
    if (!u) {
      throw new NotExistException('user');
    }

    const user = await validateUser(req.body.username, req.body.password);
    if (user) {
      return res.status(StatusCodes.OK).json({ token: createToken(u) });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'The username or password are incorrect',
    });
  } catch (error) {
    next(error);
  }
};
