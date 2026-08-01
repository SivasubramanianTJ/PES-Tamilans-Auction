import { Router } from "express";
import { createSeasonController } from "../controllers/season.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/authorize.middleware.js";
import { finishSeasonController } from "../controllers/season.controller.js";

const router = Router();

router.post("/", authenticate, createSeasonController);

router.post(
  "/finish",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  finishSeasonController
);

export default router;