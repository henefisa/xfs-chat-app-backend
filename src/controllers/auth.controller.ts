import { checkOtp } from '../services/otp.service';
import { sendEmail } from 'src/services/otp.service';
import { RefreshTokenDto } from 'src/dto/auth/refresh-token.dto';
import { createRefreshToken, refreshToken } from 'src/services/auth.service';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { createToken } from 'src/services/auth.service';
import { comparePassword, createUser } from 'src/services/user.service';
import { RequestWithBody } from 'src/shares';
import { OtpDto } from 'src/dto/auth/otp.dto';

export const login = async (
  req: RequestWithBody<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await comparePassword(req.body);
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
    await sendEmail(req.body.email);
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
    const token = await refreshToken(req.body);
    return res.status(StatusCodes.CREATED).json(token);
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
    const check = await checkOtp(req.body);
    return res.status(StatusCodes.OK).json(check);
  } catch (error) {
    next(error);
  }
};
