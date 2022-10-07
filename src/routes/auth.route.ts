import validationMiddleware from 'src/middlewares/validation.middleware';
import { login } from 'src/controllers/auth.controller';
import { Router } from 'express';
import { loginDto } from 'src/dto/auth';

const router: Router = Router();

router.post('/login', validationMiddleware(loginDto), login);


export const authRoutes = router;
