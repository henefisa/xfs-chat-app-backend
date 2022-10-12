import { Router } from 'express';
import passport from 'passport';
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserById,
} from 'src/controllers/user.controller';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import validationMiddleware from 'src/middlewares/validation.middleware';

const router: Router = Router();
router.post('/', validationMiddleware(CreateUserDto), createUser);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(UpdateUserDto),
  updateUser
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUser
);
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getUserById
);
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(GetUserDto),
  getAllUser
);

export const UserRoutes = router;
