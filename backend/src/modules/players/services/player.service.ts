import { prisma } from "../../../config/prisma";
import { CreatePlayerInput } from "../validations/player.validation";

export async function createPlayer(data: CreatePlayerInput) {
  // Business Rule 1: Phone number must be unique
  const existingPhone = await prisma.player.findUnique({
    where: {
      phoneNumber: data.phoneNumber,
    },
  });

  if (existingPhone) {
    throw new Error("Phone number already exists");
  }

  // Business Rule 2: If userId is provided, it must exist
  if (data.userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Business Rule 3: User must not already be linked to another player
    const existingPlayer = await prisma.player.findUnique({
      where: {
        userId: data.userId,
      },
    });

    if (existingPlayer) {
      throw new Error("User is already linked to another player");
    }
  }

  const player = await prisma.player.create({
    data,
  });

  return player;
}