import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class ExistsException extends HttpException {
	constructor(target: string) {
		super(StatusCodes.BAD_REQUEST, `${target}_is_exists`);
	}
}
