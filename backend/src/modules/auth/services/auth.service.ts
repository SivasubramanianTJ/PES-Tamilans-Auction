import bcrypt from "bcrypt";
import { prisma } from "../../../config/prisma.js";
import { generateToken } from "../../../utils/jwt/jwt.js";
import {
  LoginInput,
  CreateUserInput,
  AssignCaptainInput,
} from "../validations/auth.validation.js";


import { getIO } from "../../../socket/index.js";
import { AUCTION_EVENTS } from "../../../socket/events.js";

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

  console.log("LOGIN SERVICE CALLED:", user.username);

  await prisma.user.update({
  where: {
    id: user.id,
  },
  data: {
    isOnline: true,
    lastLoginAt: new Date(),
  },
});


const io = getIO();

io.emit(AUCTION_EVENTS.CAPTAIN_STATUS, {
  userId: user.id,
  online: true,
});

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

export async function createUserService(
  data: CreateUserInput
) {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      username: data.username,
      passwordHash: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      role: true,
      isActive: true,
    },
  });

  return user;
}

export async function assignCaptainService(
  data: AssignCaptainInput
) {
  const captain = await prisma.user.findUnique({
    where: {
      id: data.captainUserId,
    },
  });

  if (!captain) {
    throw new Error("Captain not found");
  }

  if (captain.role !== "CAPTAIN") {
    throw new Error("Selected user is not a captain");
  }

  const team = await prisma.team.update({
    where: {
      id: data.teamId,
    },
    data: {
      captainUserId: data.captainUserId,
    },
    include: {
      captain: true,
    },
  });

  return {
    id: team.id,
    name: team.name,
    captainUserId: team.captainUserId,
    captainName: team.captain?.fullName,
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