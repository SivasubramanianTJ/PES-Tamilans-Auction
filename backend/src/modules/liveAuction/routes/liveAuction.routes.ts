import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";

import { startPlayerAuctionController } from "../controllers/liveAuction.controller";

const router = Router();

router.post(
  "/start-player",
  authenticate,
  startPlayerAuctionController
);

export default router;