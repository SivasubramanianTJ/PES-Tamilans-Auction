import bcrypt from "bcrypt";
import { prisma } from "../../../config/prisma";
import { generateToken } from "../../../utils/jwt/jwt";
import { LoginInput } from "../validations/auth.validation";

export async function loginService(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid username or password");
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
    },
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      role: true,
      isActive: true,
      profileImageUrl: true,
    },
  });

  return user;
}