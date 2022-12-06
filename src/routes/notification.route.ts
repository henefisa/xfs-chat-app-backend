import { SaveNotificationDto } from 'src/dto/notification/save-notification.dto';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import { Router } from 'express';
import validationMiddleware from 'src/middlewares/validation.middleware';
import { saveNotification } from 'src/controllers/notification.controller';

const router: Router = Router();

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Save new notification
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/saveNotification'
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: save notification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notification'
 *       500:
 *         description: Internal server error
 */

router.post(
  '/',
  requireAuthMiddleware,
  validationMiddleware(SaveNotificationDto),
  saveNotification
);

export const notificationRoutes = router;
