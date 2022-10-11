import { genSalt, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import dataSource from 'src/configs/data-source';
import { CreateUserDto } from 'src/dto/user';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import { User } from 'src/entities/user.entity';
import * as userService from 'src/services/user.service';
import { RequestWithBody } from 'src/shares';
import { UpdateUserDto } from './../dto/user/update-user.dto';

export const createUser = async (
  req: RequestWithBody<CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await userService.createUser(req.body);
    return res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: RequestWithBody<UpdateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const updated = await userService.updateUser(
      req.body,
      req.params.id,
      req.body.username,
      req.body.phone,
      req.body.email
    );
    return res.status(StatusCodes.CREATED).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    await userService.deleteUser(req.params.id);
    return res.status(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await userService.getOne({ where: { id: req.params.id } });
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (
  req: RequestWithBody<GetUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const { users, count } = await userService.getUsers('', req.body);

    return res.status(StatusCodes.OK).json({
      users,
      count,
    });
  } catch (error) {
    next(error);
  }
};
