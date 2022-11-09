import { MessageRoutes } from './message.route';
import { Router } from 'express';
import { authRoutes } from './auth.route';
import { UserRoutes } from './user.route';
import { UserFriendRoutes } from './user-friend.route';
import { ConversationRoutes } from './conversation.route';

const router: Router = Router();

router.use('/users', UserRoutes);
router.use('/auth', authRoutes);
router.use('/messages', MessageRoutes);
router.use('/friends', UserFriendRoutes);
router.use('/conversation', ConversationRoutes);

export const MainRoutes = router;
