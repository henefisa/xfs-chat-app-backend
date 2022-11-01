import { RefreshTokenDto } from './../dto/auth/refresh-token.dto';
import { createRefreshToken, refreshToken } from './../services/auth.service';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { createToken } from 'src/services/auth.service';
import { comparePassword, createUser } from 'src/services/user.service';
import { RequestWithBody } from 'src/shares';

export const login = async (
  req: RequestWithBody<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await comparePassword(req.body.username, req.body.password);
    const token = createToken(user);
    const refreshToken = createRefreshToken(user);
    return res
      .status(StatusCodes.OK)
      .json({ access_token: token, refresh_token: refreshToken });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: RequestWithBody<RegisterDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await createUser(req.body);
    return res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

export const getRefreshToken = async (
  req: RequestWithBody<RefreshTokenDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const token = await refreshToken(req.body);
    return res.status(StatusCodes.CREATED).json(token);
  } catch (error) {
    next(error);
  }
};
