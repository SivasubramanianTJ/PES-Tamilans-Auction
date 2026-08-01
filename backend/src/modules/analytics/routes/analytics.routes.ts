import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/authorize.middleware.js";

import { getAnalyticsController } from "../controllers/analytics.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  getAnalyticsController
);

export default router;