import { Router } from 'express';
import { hideMessage } from 'src/controllers/hide-message.controller';
import { deleteMessage, getMessages } from 'src/controllers/message.controller';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';

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
router.delete('/delete', requireAuthMiddleware, deleteMessage);

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
router.post('/hide-message', requireAuthMiddleware, hideMessage);

/**
 * @swagger
 * /api/messages/{id}:
 *  get:
 *    summary: get list message in conversation by the id
 *    tags: [Messages]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: conversation id
 *    security:
 *          - bearerAuth: []
 *    responses:
 *      200:
 *        description: the list of message
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Message'
 *      500:
 *        description: Internal server error
 */
router.get('/:id', requireAuthMiddleware, getMessages);

export const messageRoutes = router;
