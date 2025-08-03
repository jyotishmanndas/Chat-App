import { Router } from "express";
import { userSignIn, userSignUp, getUserById } from "../controllers/user.controllers";
import { authMiddleware } from "../middleware/jwtAuth";

const router: Router = Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/:userId", authMiddleware, getUserById);

export default router;