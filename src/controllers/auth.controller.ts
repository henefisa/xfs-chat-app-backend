import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  CheckUsernameExistsDto,
  LoginDto,
  CheckEmailExistsDto,
} from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { createToken } from 'src/services/auth.service';
import {
  checkEmailExists,
  checkUsernameExists,
  comparePassword,
  createUser,
} from 'src/services/user.service';
import { RequestWithBody } from 'src/shares';

export const login = async (
  req: RequestWithBody<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await comparePassword(req.body.username, req.body.password);
    return res.status(StatusCodes.OK).json({ access_token: createToken(user) });
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

export const checkUsernameExist = async (
  req: RequestWithBody<CheckUsernameExistsDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const username = await checkUsernameExists(req.body.username);
    return res.status(StatusCodes.ACCEPTED).json(username);
  } catch (error) {
    next(error);
  }
};

export const checkEmailExist = async (
  req: RequestWithBody<CheckEmailExistsDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const email = await checkEmailExists(req.body.email);
    return res.status(StatusCodes.ACCEPTED).json(email);
  } catch (error) {
    next(error);
  }
};
