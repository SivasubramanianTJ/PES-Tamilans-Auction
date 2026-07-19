import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";
import { authorize } from "../../auth/middleware/authorize.middleware";

import { createTeamController } from "../controllers/team.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  createTeamController
);

export default router;