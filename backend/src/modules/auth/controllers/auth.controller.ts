import { Request, Response } from "express";
import { loginSchema } from "../validations/auth.validation";
import { loginService } from "../services/auth.service";
import { getCurrentUser } from "../services/auth.service";

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginService(data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function me(
  req: Request,
  res: Response
) {
  const user = await getCurrentUser(req.user!.id);

  return res.json({
    success: true,
    data: user,
  });
}