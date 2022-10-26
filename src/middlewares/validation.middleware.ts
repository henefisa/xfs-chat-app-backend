import { NextFunction, Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { HttpException } from 'src/shares/http-exception';
import { StatusCodes } from 'http-status-codes';

type Class = { new (...args: any[]): any };

export interface IValidationError {
	field: string;
	rule: string;
	message: string;
}

const buildError = (errors: ValidationError[], result: IValidationError[]) => {
	errors.forEach((el) => {
		if (el.children) {
			buildError(el.children, result);
		}

		const prop = el.property;
		Object.entries(el.constraints || {}).forEach((constraint) => {
			result.push({
				field: prop,
				rule: constraint[0],
				message: constraint[1],
			});
		});
	});

	return result;
};

const validationMiddleware = (dto: Class) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = Object.assign(new dto(), req.body);
			const errors = await validate(data, { whitelist: true });
			const result: IValidationError[] = [];

			if (errors.length > 0) {
				throw new HttpException(
					StatusCodes.BAD_REQUEST,
					'Input data validation failed',
					buildError(errors, result)
				);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

export default validationMiddleware;
