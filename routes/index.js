import { Router } from "express";
import UserRoutes from "./userRoutes.js";
import WebexRoutes from "./webexRoutes.js";

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/webex", WebexRoutes);

export default router;
