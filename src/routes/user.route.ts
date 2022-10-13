import { Router } from 'express';
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserById,
  getUserProfile,
} from 'src/controllers/user.controller';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';

const router: Router = Router();
router.post(
  '/',
  requireAuthMiddleware,
  validationMiddleware(CreateUserDto),
  createUser
);
router.put(
  '/:id',
  requireAuthMiddleware,
  validationMiddleware(UpdateUserDto),
  updateUser
);
router.delete('/:id', requireAuthMiddleware, deleteUser);
router.get('/profile', requireAuthMiddleware, getUserProfile);
router.get('/:id', requireAuthMiddleware, getUserById);
router.get(
  '/',
  requireAuthMiddleware,
  validationMiddleware(GetUserDto),
  getAllUser
);

export const UserRoutes = router;
