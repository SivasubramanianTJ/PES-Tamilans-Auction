import { Router } from "express";
import {
  loginController,
  me,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginController);

router.get(
  "/me",
  authenticate,
  me
);

export default router;