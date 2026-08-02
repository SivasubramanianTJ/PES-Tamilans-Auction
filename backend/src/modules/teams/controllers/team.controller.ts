import { Request, Response } from "express";
import {
  createTeamSchema,
  assignCaptainSchema,
} from "../validations/team.validation.js";
import {
  createTeam,
  getLiveTeamsService,
  getAllTeamsService,
  assignCaptainService,
  getAvailableCaptainsService,
} from "../services/team.service.js";
import { getMyTeamService } from "../services/team.service.js";
import {
  deleteTeamService,
} from "../services/team.service.js";

export async function createTeamController(
  req: Request,
  res: Response
) {
  try {
    const data = createTeamSchema.parse(req.body);

    const team = await createTeam(data);

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  } catch (error) {
  console.error("===== CREATE TEAM ERROR =====");
  console.error(error);

  return res.status(400).json({
    success: false,
    error: error instanceof Error ? error.message : error,
  });
}
}

export async function assignCaptainController(
  req: Request,
  res: Response
) {
  try {
    const data = assignCaptainSchema.parse(req.body);

    const team = await assignCaptainService(
      data.teamId,
      data.captainUserId
    );

    return res.status(200).json({
      success: true,
      message: "Captain assigned successfully",
      data: team,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function getLiveTeamsController(
  req: Request,
  res: Response
) {
  try {
    const result = await getLiveTeamsService();

    const serializedResult = JSON.parse(
      JSON.stringify(result, (_, value) =>
        typeof value === "bigint"
          ? value.toString()
          : value
      )
    );

    return res.status(200).json({
      success: true,
      data: serializedResult,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function uploadTeamLogoController(
  req: Request,
  res: Response
) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No logo uploaded",
    });
  }

  return res.json({
    success: true,
    filename: req.file.filename,
    url: `import.meta.env.VITE_API_URL/uploads/team-logos/${req.file.filename}`,
  });
}

export async function getMyTeamController(
  req: Request,
  res: Response
) {
  try {
    const result = await getMyTeamService(req.user!.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

export async function getAllTeamsController(
  req: Request,
  res: Response
) {
  try {
    const teams = await getAllTeamsService();

    const serializedTeams = JSON.parse(
      JSON.stringify(
        teams,
        (_, value) =>
          typeof value === "bigint"
            ? value.toString()
            : value
      )
    );

    return res.status(200).json({
      success: true,
      data: serializedTeams,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

  }
}

export async function deleteTeamController(
  req: Request,
  res: Response
) {
  try {
    const result = await deleteTeamService(
  req.params.id as string
);

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      error: error.message,
    });

  }
}

export async function getAvailableCaptainsController(
  req: Request,
  res: Response
) {
  try {
    const captains = await getAvailableCaptainsService();

    return res.status(200).json({
      success: true,
      data: captains,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      error: error.message,
    });

  }
}