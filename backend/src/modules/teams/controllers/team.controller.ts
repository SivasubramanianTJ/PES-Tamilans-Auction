import { Request, Response } from "express";
import { createTeamSchema } from "../validations/team.validation";
import { createTeam } from "../services/team.service";

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