import { prisma } from "../../../config/prisma";
import { CreateSeasonPlayerInput } from "../validations/seasonPlayer.validation";

export async function createSeasonPlayer(
  data: CreateSeasonPlayerInput
) {
  // Get active season
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  // Check player exists
  const player = await prisma.player.findUnique({
    where: {
      id: data.playerId,
    },
  });

  if (!player) {
    throw new Error("Player not found");
  }

  // Prevent duplicate entry
  const existing = await prisma.seasonPlayer.findUnique({
    where: {
      seasonId_playerId: {
        seasonId: season.id,
        playerId: data.playerId,
      },
    },
  });

  if (existing) {
    throw new Error("Player already added to this season");
  }

  return prisma.seasonPlayer.create({
    data: {
      seasonId: season.id,
      playerId: data.playerId,

      basePrice: BigInt(data.basePrice),

      isRetentionEligible: data.isRetentionEligible,
      isRTMEligible: data.isRTMEligible,
    },
  });
}