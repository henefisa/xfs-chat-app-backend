import { Router } from "express";
import { createUser } from "src/controllers/user.controller";
import { CreateUserDto } from "src/dto/user";
import validationMiddleware from "src/middlewares/validation.middleware";

const router: Router = Router();

router.post("/", validationMiddleware(CreateUserDto), createUser);

export const UserRoutes = router;
