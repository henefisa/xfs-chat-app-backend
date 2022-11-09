import { Router } from 'express';
import {
  createConversation,
  getConversationById,
} from 'src/controllers/conversation.controller';

const router: Router = Router();

router.post('/', createConversation);
router.get('/:id', getConversationById);

export const ConversationRoutes = router;
