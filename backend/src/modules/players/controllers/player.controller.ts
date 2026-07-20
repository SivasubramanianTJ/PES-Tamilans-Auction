import { Request, Response } from "express";

import { createPlayerSchema } from "../validations/player.validation";
import { createPlayer } from "../services/player.service";

export async function createPlayerController(
  req: Request,
  res: Response
) {
  try {
    const data = createPlayerSchema.parse(req.body);

    const player = await createPlayer(data);

    return res.status(201).json({
      success: true,
      message: "Player created successfully",
      data: player,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}