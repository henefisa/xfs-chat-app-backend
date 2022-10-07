import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import dataSource from 'src/configs/data-source';
import 'reflect-metadata';
import { MainRoutes } from './routes';
import { HttpException } from './shares/http-exception';
import passport from 'passport';
import passportMiddleware from 'src/middlewares/passport';

dotenv.config({
  path:
    process.env.NODE_ENV !== undefined
      ? `.${process.env.NODE_ENV.trim()}.env`
      : '.env',
});

const server = express();
const port = process.env.PORT || 8000;

const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    return response.status(error.status).json({
      statusCode: error.status || 400,
      message: error.message,
      timestamp: Date.now(),
      path: request.path,
      errors: error.errors,
    });
  }

  next(error);
};
passport.use(passportMiddleware);
server.use(passport.initialize());
server.use(express.json());
server.use('/api', MainRoutes);
server.use(errorHandler);

dataSource
  .initialize()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((error) => {
    console.log(error);

    console.log(`Failed to connect database`, error);
  });

server.get('/', (req: Request, res: Response) => {
  res.send('Express + TS server');
});

server.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
