import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoginDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { createToken } from 'src/services/auth.service';
import { comparePassword, createUser } from 'src/services/user.service';
import { RequestWithBody } from 'src/shares';

export const login = async (
	req: RequestWithBody<LoginDto>,
	res: Response,
	next: NextFunction
) => {
	try {
		res.setHeader('Content-Type', 'application/json');
		const user = await comparePassword(req.body.username, req.body.password);
		const token = createToken(user);
		return res.status(StatusCodes.OK).json({ access_token: token });
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
