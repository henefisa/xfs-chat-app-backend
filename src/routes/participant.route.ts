import { Router } from 'express';
import { addMember } from 'src/controllers/participants.controller';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';

const router: Router = Router();

/**
 * @swagger
 * /api/participants/{id}:
 *   post:
 *     summary: add member into conversation
 *     tags: [Participant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: conversation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addParticipant'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 */
router.post('/:id', requireAuthMiddleware, addMember);

export const participantRoutes = router;
