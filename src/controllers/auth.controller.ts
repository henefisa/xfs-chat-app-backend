import { checkOtp, sendOtp } from 'src/services/send-otp.service';
import { RefreshTokenDto } from 'src/dto/auth/refresh-token.dto';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { comparePassword, createUser } from 'src/services/user.service';
import { messages, RequestWithBody } from 'src/shares';
import { OtpDto } from 'src/dto/auth/otp.dto';
import redis from 'src/configs/Redis';
import * as authService from 'src/services/auth.service';
import { getRefreshTokenKey } from 'src/utils/redis';
import { LogoutDto } from 'src/dto/auth/logout.dto';
import { User } from 'src/entities/user.entity';

export const login = async (
  req: RequestWithBody<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await comparePassword(req.body);
    const token = authService.createToken(user);
    const refreshToken = authService.createRefreshToken(user);
    redis.set(getRefreshTokenKey(user.id), refreshToken);

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

    return res
      .status(StatusCodes.CREATED)
      .json({ ...user, password: undefined });
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
    const token = await authService.refreshToken(req.body);

    return res.status(StatusCodes.CREATED).json(token);
  } catch (error) {
    next(error);
  }
};

export const sendOtpRegister = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    await sendOtp(user.email);

    return res.status(StatusCodes.OK).json(messages.Successfully);
  } catch (error) {
    next(error);
  }
};

export const checkOtpRegister = async (
  req: RequestWithBody<OtpDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;
    const check = await checkOtp(user.email, req.body.otp);
    return res.status(StatusCodes.OK).json(check);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: RequestWithBody<LogoutDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.logout(req.body);

    return res.status(StatusCodes.NO_CONTENT).json();
  } catch (error) {
    next(error);
  }
};
