import { Router } from "express";

import {
  createConversation,
  getConversations,
} from "../controllers/chatController";

const router = Router();

router.post("/", createConversation);

router.get("/:userId", getConversations);

export default router;