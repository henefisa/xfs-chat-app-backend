import { GetMessageDto } from 'src/dto/message/get-message.dto';
import { sendMessageDto } from 'src/dto/message/send-message.dto';
import validationMiddleware from 'src/middlewares/validation.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import { Router } from 'express';
import {
  deleteMessages,
  getMessages,
  sendMessages,
} from 'src/controllers/message.controller';

const router: Router = Router();

router.post(
  '/',
  requireAuthMiddleware,
  validationMiddleware(sendMessageDto),
  sendMessages
);
router.get(
  '/:conversationId',
  requireAuthMiddleware,
  validationMiddleware(GetMessageDto),
  getMessages
);
router.delete('/:id', requireAuthMiddleware, deleteMessages);

export const MessageRoutes = router;
