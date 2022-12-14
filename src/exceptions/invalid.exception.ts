import { StatusCodes } from 'http-status-codes';
import { HttpException } from 'src/shares/http-exception';

export class InvalidSenderException extends HttpException {
  constructor() {
    super(StatusCodes.BAD_REQUEST, 'sender_invalid');
  }
}
