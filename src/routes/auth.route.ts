import { RefreshTokenDto } from 'src/dto/auth/refresh-token.dto';
import validationMiddleware from 'src/middlewares/validation.middleware';
import {
  getRefreshToken,
  login,
  register,
} from 'src/controllers/auth.controller';
import { Router } from 'express';
import { LoginDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';

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
router.post('/login', validationMiddleware(LoginDto), login);

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

router.post('/register', validationMiddleware(RegisterDto), register);

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
  getRefreshToken
);

export const authRoutes = router;
