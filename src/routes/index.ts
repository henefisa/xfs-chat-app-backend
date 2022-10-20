import { MessageRoutes } from './message.route';
import { Router } from 'express';
import { authRoutes } from './auth.route';
import { UserRoutes } from './user.route';

const router: Router = Router();

router.use('/users', UserRoutes);
router.use('/auth', authRoutes);
router.use('/messages', MessageRoutes);

export const MainRoutes = router;
