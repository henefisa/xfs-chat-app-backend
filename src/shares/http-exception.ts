import { IValidationError } from 'src/middlewares/validation.middleware';

export class HttpException extends Error {
  public status: number;
  public message: string;
  public errors?: IValidationError[];

  constructor(status: number, message: string, errors?: IValidationError[]) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
