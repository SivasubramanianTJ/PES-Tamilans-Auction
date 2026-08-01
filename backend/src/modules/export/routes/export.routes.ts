import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";
import { authorize } from "../../auth/middleware/authorize.middleware";

import { exportExcelController } from "../controllers/export.controller";

const router = Router();

router.get(
  "/excel",
  authenticate,
  authorize("SUPER_ADMIN"),
  exportExcelController
);

export default router;