import { NextFunction, Response } from "express";
import { CreateUserDto } from "src/dto/user";
import { User } from "src/entities/user.entity";
import { RequestWithBody } from "src/shares";
import { StatusCodes } from "http-status-codes";
import { hash, genSalt } from "bcrypt";
import dataSource from "src/configs/data-source";

const userRepository = dataSource.getRepository(User);

export const createUser = async (
  req: RequestWithBody<CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = new User();
    user.username = req.body.username;
    user.password = await hash(req.body.password, await genSalt());
    const saved = await userRepository.save(user);

    return res.status(StatusCodes.CREATED).json(saved);
  } catch (error) {
    next(error);
  }
};
