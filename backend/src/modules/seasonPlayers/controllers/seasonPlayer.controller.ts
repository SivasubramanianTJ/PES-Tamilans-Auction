import { Request, Response } from "express";

import { createSeasonPlayerSchema } from "../validations/seasonPlayer.validation";
import { createSeasonPlayer } from "../services/seasonPlayer.service";

export async function createSeasonPlayerController(
  req: Request,
  res: Response
) {
  try {
    const data = createSeasonPlayerSchema.parse(req.body);

    const seasonPlayer = await createSeasonPlayer(data);

    const serializedSeasonPlayer = JSON.parse(
      JSON.stringify(
        seasonPlayer,
        (_, value) =>
          typeof value === "bigint" ? value.toString() : value
      )
    );

    return res.status(201).json({
      success: true,
      message: "Player added to season successfully",
      data: serializedSeasonPlayer,
    });
  } catch (error: unknown) {
    console.error(error);

    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}