import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class ForbiddenException extends HttpException {
  constructor() {
    super(StatusCodes.FORBIDDEN, 'forbidden');
  }
}
