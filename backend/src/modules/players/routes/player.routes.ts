import { Router } from "express";

import {
  createPlayerController,
  importPlayersController,
  uploadPlayerImagesController,
} from "../controllers/player.controller";
import { authenticate } from "../../auth/middleware/auth.middleware";
import { upload } from "../../auth/middleware/upload.middleware";
import { playerImageUpload } from "../middleware/playerImageUpload.middleware";
import {
  getPlayersController,
} from "../controllers/player.controller";

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