import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import { RefreshTokenDto } from 'src/dto/auth/refresh-token.dto';
import validationMiddleware from 'src/middlewares/validation.middleware';
import * as authController from 'src/controllers/auth.controller';
import { Router } from 'express';
import { LoginDto, OtpDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { LogoutDto } from 'src/dto/auth/logout.dto';

const router: Router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       200:
 *         description: successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/token'
 *       401:
 *         description: UnAuthentication
 */
router.post('/login', validationMiddleware(LoginDto), authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUser'
 *     responses:
 *       200:
 *         description: user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createUser'
 *       500:
 *         description: Some server error
 */

router.post(
  '/register',
  validationMiddleware(RegisterDto),
  authController.register
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: get refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                type: object
 *                properties:
 *                   refreshToken:
 *                      type: string
 *                      description: refreshToken
 *     responses:
 *       200:
 *         description: user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   refresh_token:
 *                      type: string
 *                      description: refresh token
 *                   access_token:
 *                      type: string
 *                      description: access token
 *       500:
 *         description: Some server error
 */

router.post(
  '/refresh-token',
  validationMiddleware(RefreshTokenDto),
  authController.getRefreshToken
);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: send otp to email
 *     tags: [Auth]
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *       500:
 *         description: Some server error
 */

router.post('/send-otp', requireAuthMiddleware, authController.sendOtpRegister);

/**
 * @swagger
 * /api/auth/check-otp:
 *   post:
 *     summary: check otp
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                type: object
 *                properties:
 *                   otp:
 *                      type: string
 *                      description: otp
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *       500:
 *         description: Some server error
 */

router.post(
  '/check-otp',
  requireAuthMiddleware,
  validationMiddleware(OtpDto),
  authController.checkOtpRegister
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                type: object
 *                properties:
 *                   refreshToken:
 *                      type: string
 *                      description: refreshToken
 *     responses:
 *       200:
 *         description: Logout successfully
 *       500:
 *         description: Internal server error
 */

router.post('/logout', validationMiddleware(LogoutDto), authController.logout);

/**
 * @swagger
 * /api/auth/check-activate:
 *   get:
 *     summary: check validate activate
 *     tags: [Auth]
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: check successfully
 *       500:
 *         description: Internal server error
 */

router.get(
  '/check-activate',
  requireAuthMiddleware,
  authController.checkActivate
);

export const authRoutes = router;
