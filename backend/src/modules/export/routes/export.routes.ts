import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/authorize.middleware.js";

import { exportExcelController } from "../controllers/export.controller.js";

const router = Router();

router.get(
  "/excel",
  authenticate,
  authorize("SUPER_ADMIN"),
  exportExcelController
);

export default router;