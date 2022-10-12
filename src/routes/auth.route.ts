import validationMiddleware from 'src/middlewares/validation.middleware';
import { login, register } from 'src/controllers/auth.controller';
import { Router } from 'express';
import { LoginDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';

const router: Router = Router();

router.post('/login', validationMiddleware(LoginDto), login);
router.post('/register', validationMiddleware(RegisterDto), register);

export const authRoutes = router;
