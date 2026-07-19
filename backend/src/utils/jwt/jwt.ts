import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export function generateToken(
  userId: string,
  role: string
) {
  return jwt.sign(
    {
      userId,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
}