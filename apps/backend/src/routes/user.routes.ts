import { Router } from "express";
import { userSignIn, userSignUp, getUserProfile } from "../controllers/user.controllers";
import { authMiddleware } from "../middleware/jwtAuth";

const router: Router = Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/userProfile", authMiddleware, getUserProfile);

export default router;