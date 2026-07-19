import { Router } from "express";
import { createSeasonController } from "../controllers/season.controller";
import { authenticate } from "../../auth/middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createSeasonController);

export default router;