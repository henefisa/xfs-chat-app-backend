import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class NotFoundException extends HttpException {
	constructor(target: string) {
		super(StatusCodes.BAD_REQUEST, `${target}_not_found`);
	}
}
export class NotExistException extends HttpException {
	constructor(target: string) {
		super(StatusCodes.BAD_REQUEST, `${target}_not_exist`);
	}
}
