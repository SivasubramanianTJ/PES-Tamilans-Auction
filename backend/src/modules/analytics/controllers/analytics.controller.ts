import { Request, Response } from "express";
import { getAuctionAnalytics } from "../services/analytics.service";

export async function getAnalyticsController(
  req: Request,
  res: Response
) {
  try {
    const result = await getAuctionAnalytics();

    const serialized = JSON.parse(
      JSON.stringify(result, (_, value) =>
        typeof value === "bigint"
          ? value.toString()
          : value
      )
    );

    return res.json({
      success: true,
      data: serialized,
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