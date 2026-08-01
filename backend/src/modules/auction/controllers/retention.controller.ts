import { Request, Response } from "express";
import { retentionSchema } from "../validations/retention.validation.js";
import { retentionService } from "../services/retention.service.js";

export async function retentionController(
  req: Request,
  res: Response
) {
  try {
    const data = retentionSchema.parse(req.body);

    const result = await retentionService(data);

    return res.status(200).json({
      success: true,
      message: "Retention completed successfully",
      data: result,
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