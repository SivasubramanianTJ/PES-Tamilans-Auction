import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";
import { authorize } from "../../auth/middleware/authorize.middleware";

import { getAnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  getAnalyticsController
);

export default router;