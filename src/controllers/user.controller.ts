import { message } from 'src/shares/message';
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
      throw new HttpException(StatusCodes.BAD_REQUEST, message.User_not_found);
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
    const user = await userRepository.findOneBy({
      id: req.params.id,
    });
    if (!user) {
      throw new HttpException(StatusCodes.BAD_REQUEST, message.User_not_found);
    }
    user.username = req.body.username;
    user.password = await hash(req.body.password, await genSalt());
    user.fullName = req.body.fullName;
    user.avatar = req.body.avatar;
    user.phone = req.body.phone;
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
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: req.params.id })
      .execute();

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
    const userToGet = await userRepository.findOneBy({
      id: req.params.id,
    });
    if (!userToGet) {
      throw new HttpException(StatusCodes.BAD_REQUEST, message.User_not_found);
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
    return res.status(StatusCodes.OK).json(userToGetAll);
  } catch (error) {
    next(error);
  }
};
