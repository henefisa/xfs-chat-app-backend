import { login } from 'src/controllers/auth.controller';
import passport from 'passport';
import { Router } from 'express';

const router: Router = Router();

router.post('/login', passport.authenticate('login'), login);

export const authRoutes = router;
