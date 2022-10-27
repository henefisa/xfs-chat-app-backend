import { Request } from 'express';

export interface RequestWithBody<T = Record<string, unknown>> extends Request {
  body: T;
}
