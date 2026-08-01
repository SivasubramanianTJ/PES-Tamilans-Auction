import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/authorize.middleware.js";

import {
  createTeamController,
  getLiveTeamsController,
  uploadTeamLogoController,
} from "../controllers/team.controller.js";
import { teamLogoUpload } from "../middleware/teamLogoUpload.middleware.js";

import { getMyTeamController } from "../controllers/team.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  createTeamController
);

router.get(
  "/live",
  getLiveTeamsController
);

router.post(
  "/logo",
  teamLogoUpload.single("logo"),
  uploadTeamLogoController
);

router.get(
  "/my-team",
  authenticate,
  authorize("CAPTAIN"),
  getMyTeamController
);

export default router;