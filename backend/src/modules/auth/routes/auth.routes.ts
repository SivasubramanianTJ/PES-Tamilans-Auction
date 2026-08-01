import { Router } from "express";
import {
  loginController,
  createUserController,
  me,
  assignCaptainController,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.post(
  "/create-user",
  authenticate,
  authorize("SUPER_ADMIN"),
  createUserController
);

router.post(
  "/assign-captain",
  authenticate,
  authorize("SUPER_ADMIN"),
  assignCaptainController
);

router.post("/login", loginController);

router.get(
  "/me",
  authenticate,
  authorize("SUPER_ADMIN"),
  me
);

export default router;