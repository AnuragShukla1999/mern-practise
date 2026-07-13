import { Router } from "express";

import { getMessages, sendMessage } from "../controllers/message.controller";

const router = Router();

router.post("/", sendMessage);

router.get("/:conversationId", getMessages);

export default router;