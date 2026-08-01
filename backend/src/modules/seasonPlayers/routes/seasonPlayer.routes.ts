import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { createSeasonPlayerController } from "../controllers/seasonPlayer.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  createSeasonPlayerController
);

export default router;