import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type JwtPayload = {
  userId: string;
  role: string;
};

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

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as JwtPayload;
}