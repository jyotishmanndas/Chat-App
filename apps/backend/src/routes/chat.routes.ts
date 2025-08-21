import { Router } from "express";
import { authMiddleware } from "../middleware/jwtAuth";
import { ChatMessage, getRoomMessage } from "../controllers/chat.controllers";

const router: Router = Router();

router.post("/createmessage", authMiddleware, ChatMessage);
router.get("/roommessage/:id", authMiddleware, getRoomMessage)

export default router