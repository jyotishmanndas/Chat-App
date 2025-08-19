import { Router } from "express";
import { joinRoom, roomCreate } from "../controllers/room.controllers";
import { authMiddleware } from "../middleware/jwtAuth";

const router: Router = Router();

router.post("/create", authMiddleware, roomCreate);
router.get("/joinroom/:id", authMiddleware, joinRoom)

export default router;