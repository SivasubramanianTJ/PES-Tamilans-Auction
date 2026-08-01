import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { startAuctionController } from "../controllers/auction.controller.js";

import { retentionController } from "../controllers/retention.controller.js";
import { authorize } from "../../auth/middleware/authorize.middleware.js";

const router = Router();

router.post(
  "/start",
  authenticate,
  startAuctionController
);

router.post(
  "/retention",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  retentionController
);

export default router;