import { Request, Response } from "express";
import { createSeason } from "../services/season.service";
import { createSeasonSchema } from "../validations/season.validation";

export async function createSeasonController(
  req: Request,
  res: Response
) {
  try {
    const data = createSeasonSchema.parse(req.body);

    const season = await createSeason(data);

    const serializedSeason = JSON.parse(
      JSON.stringify(
        season,
        (_, value) => (typeof value === "bigint" ? value.toString() : value)
      )
    );

    return res.status(201).json({
      success: true,
      message: "Season created successfully",
      data: serializedSeason,
    });
  } catch (error: unknown) {
  console.error(error);

  return res.status(400).json({
    success: false,
    error: error instanceof Error ? error.message : "Unknown error",
  });
  }
}