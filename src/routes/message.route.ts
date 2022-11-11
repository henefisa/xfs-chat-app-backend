import { Router } from 'express';
import { hideMessage } from 'src/controllers/hide-message.controller';
import {
  deleteMessage,
  getMessages,
  sendMessage,
} from 'src/controllers/message.controller';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';

const router: Router = Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: send message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createMessage'
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *          description: send message successfully
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    id:
 *                       type: string
 *                       description: id
 *                    sender:
 *                       type: string
 *                       description: sender
 *                    message:
 *                       type: string
 *                       description: message
 *                    attachment:
 *                       type: string
 *                       description: attachment
 *                    conversation:
 *                       type: string
 *                       description: conversation id
 *                    createAt:
 *                       type: string
 *                       description: create at
 *                    updateAt:
 *                       type: string
 *                       description: update at
 *                 example:
 *                    id: "0a215b6b-f102-4c9b-bd19-67b8ff34f8fb"
 *                    sender: "5c6aa055-7eb1-4b71-8a91-d2f7795117bf"
 *                    conversation: "fbbb20b9-c25e-430b-9222-7acf59b0aa23"
 *                    message: "Hello world!"
 *                    attachment: null
 *                    createAt: "2022-11-08T16:35:32.703Z"
 *                    updateAt: "2022-11-08T16:35:32.703Z"
 *       500:
 *         description: Internal server error
 */

router.post('/', requireAuthMiddleware, sendMessage);

router.post('/delete', requireAuthMiddleware, deleteMessage);

router.post('/hide-message', requireAuthMiddleware, hideMessage);

router.get('/:id', requireAuthMiddleware, getMessages);

export const MessageRoutes = router;
