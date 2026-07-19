import { Router } from "express";
import {
  loginController,
  me,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = Router();

router.post("/login", loginController);

router.get(
  "/me",
  authenticate,
  authorize("SUPER_ADMIN"),
  me
);

export default router;