import { Router } from 'express';
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserById,
} from 'src/controllers/user.controller';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user';
import validationMiddleware from 'src/middlewares/validation.middleware';

const router: Router = Router();

router.post('/', validationMiddleware(CreateUserDto), createUser);
router.put('/:id', validationMiddleware(UpdateUserDto), updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserById);
router.get('/', getAllUser);

export const UserRoutes = router;
