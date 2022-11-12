import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CheckEmailExistsDto, CheckUsernameExistsDto } from 'src/dto/auth';
import { CreateUserDto } from 'src/dto/user';
import { UpdatePasswordUserDto } from 'src/dto/user/update-password-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { User } from 'src/entities/user.entity';
import * as userService from 'src/services/user.service';
import { RequestWithBody } from 'src/shares';

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
    const updated = await userService.updateUser(req.body, req.params.id);
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

export const selfDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;
    await userService.deleteUser(user.id);

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
    const user = await userService.getOne({
      where: { id: req.params.id },
    });
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = req.user as User;
    const { users, count } = await userService.getUsers(user.id, req.query);
    return res.status(StatusCodes.OK).json({
      users,
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return null;
  }

  const reqUser = req.user as User;

  try {
    const user = await userService.getOneOrThrow({
      where: { id: reqUser.id },
    });

    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfileUser = async (
  req: RequestWithBody<UpdateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    const user = req.user as User;

    const updated = await userService.updateProfileUser(req.body, user.id);

    return res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

export const updatePasswordUser = async (
  req: RequestWithBody<UpdatePasswordUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    if (!req.user) {
      return null;
    }
    const reqUser = req.user as User;
    await userService.updatePasswordUser(req.body, reqUser.id);
    return res.status(StatusCodes.OK).json({});
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
    const username = await userService.checkRegisterUsernameExists(
      req.body.username
    );
    return res.status(StatusCodes.OK).json(username);
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
    const email = await userService.checkRegisterEmailExists(req.body.email);
    return res.status(StatusCodes.OK).json(email);
  } catch (error) {
    next(error);
  }
};

export const selfDeactivate = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;
    await userService.Deactivate(user.id);
    return res.status(StatusCodes.NO_CONTENT).json();
  } catch (error) {
    next(error);
  }
};
