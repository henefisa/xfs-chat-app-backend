import { GetMessageDto } from './../dto/message/get-message.dto';
import { sendMessageDto } from './../dto/message/send-message.dto';
import validationMiddleware from 'src/middlewares/validation.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import { Router } from 'express';
import {
  sendMessage,
  getMessage,
  deleteMessage,
} from 'src/controllers/message.controller';

const router: Router = Router();

router.post(
  '/',
  requireAuthMiddleware,
  validationMiddleware(sendMessageDto),
  sendMessage
);
router.get(
  '/:conversationId',
  requireAuthMiddleware,
  validationMiddleware(GetMessageDto),
  getMessage
);
router.delete('/:id', requireAuthMiddleware, deleteMessage);

export const MessageRoutes = router;
