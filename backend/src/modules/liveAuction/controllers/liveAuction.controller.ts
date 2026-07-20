import { Request, Response } from "express";
import { startPlayerSchema } from "../validations/liveAuction.validation";
import { startPlayerAuctionService } from "../services/liveAuction.service";

export async function startPlayerAuctionController(
  req: Request,
  res: Response
) {
  try {
    const data = startPlayerSchema.parse(req.body);

const result = await startPlayerAuctionService(data);

const serializedResult = JSON.parse(
  JSON.stringify(result, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  )
);

return res.status(200).json({
  success: true,
  message: "Player auction started successfully",
  data: serializedResult,
});
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}