import { Router } from "express";

import { createPlayerController } from "../controllers/player.controller";
import { authenticate } from "../../auth/middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createPlayerController);

export default router;