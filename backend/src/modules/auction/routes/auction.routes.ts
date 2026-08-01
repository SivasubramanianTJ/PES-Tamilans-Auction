import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";
import { startAuctionController } from "../controllers/auction.controller";

import { retentionController } from "../controllers/retention.controller";
import { authorize } from "../../auth/middleware/authorize.middleware";

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