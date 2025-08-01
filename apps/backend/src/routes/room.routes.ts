import { Router } from "express";
import { roomCreate } from "../controllers/room.controllers";
import { authMiddleware } from "../middleware/jwtAuth";

const router:Router = Router();

router.post("/create", authMiddleware, roomCreate)

export default router;