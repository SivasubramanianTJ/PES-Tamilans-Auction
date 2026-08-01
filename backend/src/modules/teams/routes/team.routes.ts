import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware";
import { authorize } from "../../auth/middleware/authorize.middleware";

import {
  createTeamController,
  getLiveTeamsController,
  uploadTeamLogoController,
} from "../controllers/team.controller";
import { teamLogoUpload } from "../middleware/teamLogoUpload.middleware";

import { getMyTeamController } from "../controllers/team.controller";

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