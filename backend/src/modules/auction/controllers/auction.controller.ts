import { Request, Response } from "express";
import { startAuctionSchema } from "../validations/auction.validation";
import { startAuction } from "../services/auction.service";

export async function startAuctionController(
  req: Request,
  res: Response
) {
  try {
    startAuctionSchema.parse(req.body);

    const season = await startAuction();

    const serializedSeason = JSON.parse(
      JSON.stringify(
        season,
        (_, value) => (typeof value === "bigint" ? value.toString() : value)
      )
    );

    return res.status(200).json({
      success: true,
      message: "Auction started successfully",
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