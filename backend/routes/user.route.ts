// getOnlineUsers

import { Router } from "express";
import { getOnlineUsers } from "../controllers/userController";

const router = Router();

router.get("/:id/online-users", getOnlineUsers);

export default router;