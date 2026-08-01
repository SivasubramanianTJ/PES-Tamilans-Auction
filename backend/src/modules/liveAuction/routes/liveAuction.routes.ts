import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

// import { startPlayerAuctionController } from "../controllers/liveAuction.controller.js";

// import { finishPlayerAuctionController } from "../controllers/liveAuction.controller.js";

// import { placeBidController } from "../controllers/liveAuction.controller.js";

import {
  startPlayerAuctionController,
  placeBidController,
  finishPlayerAuctionController,
  getCurrentAuctionController,
  getBidHistoryController,
  getRemainingPlayersController,
} from "../controllers/liveAuction.controller.js";

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

router.get(
  "/players",
  authenticate,
  getRemainingPlayersController
);

export default router;