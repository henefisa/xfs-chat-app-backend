import { messageRoutes } from './message.route';
import { Router } from 'express';
import { authRoutes } from './auth.route';
import { userRoutes } from './user.route';
import { userFriendRoutes } from './user-friend.route';
import { conversationRoutes } from './conversation.route';
import { uploadRoutes } from './upload.route';
import { participantRoutes } from './participant.route';
import { adminRoutes } from './admin.route';
import { resetPasswordRoutes } from './reset-password.route';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);
router.use('/friends', userFriendRoutes);
router.use('/conversations', conversationRoutes);
router.use('/participants', participantRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/reset-password', resetPasswordRoutes);

export const MainRoutes = router;
