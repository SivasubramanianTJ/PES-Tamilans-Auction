import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";

// import { startPlayerAuctionController } from "../controllers/liveAuction.controller";

// import { finishPlayerAuctionController } from "../controllers/liveAuction.controller";

// import { placeBidController } from "../controllers/liveAuction.controller";

import {
  startPlayerAuctionController,
  placeBidController,
  finishPlayerAuctionController,
  getCurrentAuctionController,
  getBidHistoryController,
} from "../controllers/liveAuction.controller";

const router = Router();

router.post(
  "/start-player",
  authenticate,
  startPlayerAuctionController
);

router.post(
  "/place-bid",
  authenticate,
  placeBidController
);

router.get(
  "/current",
  authenticate,
  getCurrentAuctionController
);

router.get(
  "/bids",
  authenticate,
  getBidHistoryController
);

router.post(
  "/finish-player",
  authenticate,
  finishPlayerAuctionController
);

export default router;