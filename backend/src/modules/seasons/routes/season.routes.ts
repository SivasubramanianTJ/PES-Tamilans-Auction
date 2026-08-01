import { Router } from "express";
import { createSeasonController } from "../controllers/season.controller";
import { authenticate } from "../../auth/middleware/auth.middleware";
import { authorize } from "../../auth/middleware/authorize.middleware";
import { finishSeasonController } from "../controllers/season.controller";

const router = Router();

router.post("/", authenticate, createSeasonController);

router.post(
  "/finish",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  finishSeasonController
);

export default router;