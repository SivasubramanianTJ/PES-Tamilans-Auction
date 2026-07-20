import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";

import { createSeasonPlayerController } from "../controllers/seasonPlayer.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  createSeasonPlayerController
);

export default router;