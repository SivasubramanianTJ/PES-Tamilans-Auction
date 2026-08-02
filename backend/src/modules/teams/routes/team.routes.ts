import { Router } from "express";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/authorize.middleware.js";

import {
  createTeamController,
  getLiveTeamsController,
  uploadTeamLogoController,
  assignCaptainController,
  getAllTeamsController,
  deleteTeamController,
  getAvailableCaptainsController,
  removeCaptainController,
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

router.get(
  "/available-captains",
  authenticate,
  authorize("SUPER_ADMIN"),
  getAvailableCaptainsController
);

router.patch(
  "/assign-captain",
  authenticate,
  authorize("SUPER_ADMIN"),
  assignCaptainController
);

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  getAllTeamsController
);

router.patch(
  "/:id/remove-captain",
  authenticate,
  authorize("SUPER_ADMIN"),
  removeCaptainController
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  deleteTeamController
);

export default router;