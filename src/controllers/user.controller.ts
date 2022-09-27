import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from 'src/dto/user';
import { User } from 'src/entities/user.entity';
import { RequestWithBody } from 'src/shares';
import { StatusCodes } from 'http-status-codes';
import { hash, genSalt } from 'bcrypt';
import dataSource from 'src/configs/data-source';
import { HttpException } from 'src/shares/http-exception';

const userRepository = dataSource.getRepository(User);

export const createUser = async (
  req: RequestWithBody<CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = await hash(req.body.password, await genSalt());
    user.fullName = req.body.fullName;
    user.avatar = req.body.avatar;
    user.phone = req.body.phone;

    if (!user) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'user_not_found');
    }

    const saved = await userRepository.save(user);

    return res.status(StatusCodes.CREATED).json(saved);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToUpdate = await userRepository.findOneBy({
      id: req.params.id,
    });
    if (!userToUpdate) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'user_not_found');
    }
    userToUpdate.username = req.body.username;
    userToUpdate.password = await hash(req.body.password, await genSalt());
    userToUpdate.fullName = req.body.fullName;
    userToUpdate.avatar = req.body.avatar;
    userToUpdate.phone = req.body.phone;
    const updated = await userRepository.save(userToUpdate);

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
    const userToDelete = await userRepository.findOneBy({
      id: req.params.id,
    });
    if (!userToDelete) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'user_not_found');
    }
    await userRepository.remove(userToDelete);
    return res.status(StatusCodes.ACCEPTED);
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
    const userToGet = await userRepository.findOneBy({
      id: req.params.id,
    });
    if (!userToGet) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'user_not_found');
    }
    return res.status(StatusCodes.OK).json(userToGet);
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToGetAll = await userRepository.find();
    if (!userToGetAll) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'user_not_found');
    }
    return res.status(StatusCodes.OK).json(userToGetAll);
  } catch (error) {
    next(error);
  }
};
