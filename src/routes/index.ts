import { messageRoutes } from './message.route';
import { Router } from "express";
import { UserRoutes } from "./user.route";

const router: Router = Router();

router.use("/users", UserRoutes);
router.use("/messages",messageRoutes)

export const MainRoutes = router;
