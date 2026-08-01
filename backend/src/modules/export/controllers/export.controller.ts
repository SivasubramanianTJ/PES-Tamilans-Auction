import { Request, Response } from "express";
import { exportAuctionExcel } from "../services/export.service";

export async function exportExcelController(
  req: Request,
  res: Response
) {
  try {
    const workbook = await exportAuctionExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=AuctionResults.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

  }
}