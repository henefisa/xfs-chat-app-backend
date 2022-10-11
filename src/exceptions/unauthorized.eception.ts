import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class unauthorizedException extends HttpException {
  constructor() {
    super(StatusCodes.BAD_REQUEST, `Unauthorized`);
  }
}
