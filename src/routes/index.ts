import { Router } from "express";
import { UserRoutes } from "./user.route";

const router: Router = Router();

router.use("/users", UserRoutes);

export const MainRoutes = router;
