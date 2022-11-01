import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class forbiddenException extends HttpException {
  constructor() {
    super(StatusCodes.FORBIDDEN, 'forbidden');
  }
}
