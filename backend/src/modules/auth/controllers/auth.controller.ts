import { Request, Response } from "express";
import {
  loginSchema,
  createUserSchema,
  assignCaptainSchema,
} from "../validations/auth.validation.js";
import {
  loginService,
  getCurrentUser,
  createUserService,
  assignCaptainService,
} from "../services/auth.service.js";

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

export async function createUserController(
  req: Request,
  res: Response
) {
  try {
    const data = createUserSchema.parse(req.body);

    const user = await createUserService(data);

    return res.status(201).json({
      success: true,
      message: `${user.role} created successfully`,
      data: user,
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function assignCaptainController(
  req: Request,
  res: Response
) {
  try {
    const data = assignCaptainSchema.parse(req.body);

    const team = await assignCaptainService(data);

    return res.status(200).json({
      success: true,
      message: "Captain assigned successfully",
      data: team,
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