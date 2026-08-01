import { prisma } from "../../../config/prisma.js";
import { RetentionInput } from "../validations/retention.validation.js";

const MAX_SQUAD_SIZE = 9;

export async function retentionService(
  data: RetentionInput
) {
  const seasonPlayer = await prisma.seasonPlayer.findUnique({
    where: {
      id: data.seasonPlayerId,
    },
    include: {
      player: true,
      season: true,
    },
  });

  if (!seasonPlayer) {
    throw new Error("Player not found");
  }

  if (seasonPlayer.teamId) {
    throw new Error("Player is already assigned");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: data.teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const squadCount = await prisma.seasonPlayer.count({
    where: {
      seasonId: seasonPlayer.seasonId,
      teamId: team.id,
    },
  });

  if (squadCount >= MAX_SQUAD_SIZE) {
    throw new Error("Team squad is full");
  }

  if (team.remainingBudget < data.soldPrice) {
    throw new Error("Insufficient remaining budget");
  }

  await prisma.$transaction(async (tx) => {
    await tx.seasonPlayer.update({
      where: {
        id: seasonPlayer.id,
      },
      data: {
        teamId: team.id,
        soldPrice: data.soldPrice,
        acquisitionType: "RETENTION",
      },
    });

    await tx.team.update({
      where: {
        id: team.id,
      },
      data: {
        remainingBudget: {
          decrement: data.soldPrice,
        },
      },
    });
  });

  return {
    player: seasonPlayer.player.name,
    team: team.name,
    price: data.soldPrice.toString(),
  };
}