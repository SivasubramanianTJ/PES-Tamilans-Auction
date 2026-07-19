import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

type JwtPayload = {
  userId: string;
  role: string;
};

export function generateToken(
  userId: string,
  role: string
) {
  const secret: Secret = env.JWT_SECRET;

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      userId,
      role,
    },
    secret,
    options
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
}