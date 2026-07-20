import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";
import { startAuctionController } from "../controllers/auction.controller";

const router = Router();

router.post(
  "/start",
  authenticate,
  startAuctionController
);

export default router;