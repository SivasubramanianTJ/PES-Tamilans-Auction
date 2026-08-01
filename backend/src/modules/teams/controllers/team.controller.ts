import { Request, Response } from "express";
import { createTeamSchema } from "../validations/team.validation";
import {
  createTeam,
  getLiveTeamsService,
} from "../services/team.service";
import { getMyTeamService } from "../services/team.service";

export async function createTeamController(
  req: Request,
  res: Response
) {
  try {
    const data = createTeamSchema.parse(req.body);

    const team = await createTeam(
  data,
  req.user!.id
);

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
    url: `http://localhost:4000/uploads/team-logos/${req.file.filename}`,
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