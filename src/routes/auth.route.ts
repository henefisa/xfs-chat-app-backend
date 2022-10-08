import validationMiddleware from 'src/middlewares/validation.middleware';
import { login } from 'src/controllers/auth.controller';
import { Router } from 'express';
import { loginDto } from 'src/dto/auth';
import { CreateUserDto } from 'src/dto/user';
import { createUser } from 'src/controllers/user.controller';

const router: Router = Router();

router.post('/login', validationMiddleware(loginDto), login);
router.post('/register', validationMiddleware(CreateUserDto), createUser);

export const authRoutes = router;
