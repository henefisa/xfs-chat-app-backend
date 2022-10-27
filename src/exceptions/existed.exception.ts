import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class ExistedException extends HttpException {
  constructor(target: string) {
    super(StatusCodes.BAD_REQUEST, `${target}_already_exist`);
  }
}
