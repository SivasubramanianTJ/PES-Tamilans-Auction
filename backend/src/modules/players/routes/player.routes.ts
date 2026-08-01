import { Router } from "express";

import {
  createPlayerController,
  importPlayersController,
  uploadPlayerImagesController,
} from "../controllers/player.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { upload } from "../../auth/middleware/upload.middleware.js";
import { playerImageUpload } from "../middleware/playerImageUpload.middleware.js";
import {
  getPlayersController,
} from "../controllers/player.controller.js";

const router = Router();

router.post("/", authenticate, createPlayerController);
router.get("/", getPlayersController);

router.post(
  "/import",
  upload.single("file"),
  importPlayersController
);

router.post(
  "/images",
  playerImageUpload.array("images"),
  uploadPlayerImagesController
);

export default router;