import { Router } from "express";
import { userSignIn, userSignUp } from "../controllers/user.controllers";

const router: Router = Router();

router.post("/signup", userSignUp);
router.post("/signin", userSignIn)


export default router;