import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class UnauthorizedException extends HttpException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }
}
