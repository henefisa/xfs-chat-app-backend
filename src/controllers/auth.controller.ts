import { StatusCodes } from 'http-status-codes';
import { User } from 'src/entities/user.entity';
import { generateJWT } from 'src/services/auth.service';
import { Response, Request, NextFunction } from 'express';
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEncode = req.user as User;
    const encode = await generateJWT(userEncode);
    if (!encode) {
      return res.status(StatusCodes.UNAUTHORIZED);
    }

    res.header('Content-Type', 'application/json');
    res.cookie('accessToken', encode.accessToken, { maxAge: 60000 * 60 });
    res.write(JSON.stringify(encode));
    res.end();
  } catch (error) {
    next(error);
  }
};
