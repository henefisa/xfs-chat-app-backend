import { createToken, validateUser } from 'src/services/auth.service';
import { loginDto } from 'src/dto/auth';
import { StatusCodes } from 'http-status-codes';
import { Response, NextFunction } from 'express';
import { RequestWithBody } from 'src/shares';
import { getOneOrThrow } from 'src/services/user.service';

export const login = async (
  req: RequestWithBody<loginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Please. Send your email and password' });
    }

    const userWithUsername = getOneOrThrow({
      where: { username: req.body.username },
    });
    if (!userWithUsername) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'The User does not exists' });
    }

    const user = validateUser(req.body.username, req.body.password);
    if (await user) {
      return res
        .status(StatusCodes.OK)
        .json({ token: createToken(await userWithUsername) });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: 'The username or password are incorrect',
    });
  } catch (error) {
    next(error);
  }
};
