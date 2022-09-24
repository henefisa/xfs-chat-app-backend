import { Response } from "express";
import { CreateUserDto } from "src/dto/user/create-user.dto";
import { User } from "src/entities/user.entity";
import { RequestWithBody } from "src/shares";
import dataSource from "src/configs/data-source";
import { StatusCodes } from "http-status-codes";
import { hash, genSalt } from "bcrypt";

const userRepository = dataSource.getRepository(User);

export const createUser = async (
  req: RequestWithBody<CreateUserDto>,
  res: Response
) => {
  const user = new User();
  user.username = req.body.username;
  user.password = await hash(req.body.password, await genSalt());
  const saved = await userRepository.save(user);

  return res.status(StatusCodes.CREATED).json(saved);
};
