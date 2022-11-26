import { Router } from 'express';
import { hideMessage } from 'src/controllers/hide-message.controller';
import { deleteMessage, getMessages } from 'src/controllers/message.controller';
import { GetMessageDto } from 'src/dto/message';
import activateMiddleware from 'src/middlewares/activate.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import { validationQueryMiddleware } from 'src/middlewares/validation.middleware';

const router: Router = Router();

/**
 * @swagger
 * /api/messages/delete:
 *   delete:
 *     summary: delete message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sendDeleteRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: Message deleted
 */
router.delete(
  '/delete',
  requireAuthMiddleware,
  activateMiddleware,
  deleteMessage
);

/**
 * @swagger
 * /api/messages/hide-message:
 *   post:
 *     summary: hide message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sendDeleteRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: message has been hidden
 */
router.post('/hide-message', hideMessage);

/**
 * @swagger
 * /api/messages/{id}:
 *    get:
 *      summary: messages of conversation
 *      tags: [Messages]
 *      parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: id of conversation
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: search messages
 *         example: hello
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: page limit
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         required: false
 *         description: offset
 *      responses:
 *          200:
 *            description: succesfully
 *      security:
 *          - bearerAuth: []
 */

router.get(
  '/:id',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetMessageDto),
  getMessages
);

export const messageRoutes = router;
