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

const userRepository = dataSource.getRepository(User);

export const createUser = async (
  req: RequestWithBody<CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = new User();
    Object.assign(user, req.body);
    user.password = await hash(req.body.password, await genSalt());

    const saved = await userRepository.save(user);

    return res.status(StatusCodes.CREATED).json(saved);
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
    const user = await userService.getOneOrThrow({
      where: { id: req.params.id },
    });

    Object.assign(user, req.body);
    const updated = await userRepository.save(user);

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
    await userRepository.delete(req.params.id);
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
    const { users, count } = await userService.getUsers('', req.body);

    return res.status(StatusCodes.OK).json({
      users,
      count,
    });
  } catch (error) {
    next(error);
  }
};
