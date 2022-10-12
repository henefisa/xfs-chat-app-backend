import express, { NextFunction, Request, Response } from 'express';
import { MainRoutes } from './routes';
import { HttpException } from './shares/http-exception';
import passport from 'passport';
import passportMiddleware from 'src/middlewares/passport';

const app = express();

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
app.use(passport.initialize());
app.use(express.json());
app.use('/api', MainRoutes);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TS server');
});

export default app;
