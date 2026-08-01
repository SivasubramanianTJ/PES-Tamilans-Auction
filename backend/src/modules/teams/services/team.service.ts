import { prisma } from "../../../config/prisma.js";
import { CreateTeamInput } from "../validations/team.validation.js";

export async function createTeam(
  data: CreateTeamInput,
  captainUserId: string
) {
    const season = await prisma.season.findFirst({
  where: {
    isActive: true,
  },
});

if (!season) {
  throw new Error("No active season found");
}

  const team = await prisma.team.create({
  data: {
    seasonId: season.id,

    name: data.name,

    logoUrl: data.logoUrl,

    captainUserId,

    totalBudget: BigInt(120000000),

    remainingBudget: BigInt(120000000),
  },
});

return {
  ...team,
  totalBudget: Number(team.totalBudget),
  remainingBudget: Number(team.remainingBudget),
};
}

export async function getLiveTeamsService() {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  const teams = await prisma.team.findMany({
    where: {
      seasonId: season.id,
    },
include: {
  players: true,
  captain: {
    select: {
      isOnline: true,
      fullName: true,
      username: true,
    },
  },
},

    orderBy: {
      name: "asc",
    },
  });

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    logoUrl: team.logoUrl
  ? `http://localhost:4000/uploads/team-logos/${team.logoUrl}`
  : null,
    remainingBudget: Number(team.remainingBudget),
    playerCount: team.players.length,

captainOnline: team.captain?.isOnline ?? false,

captainName: team.captain?.fullName,
  }));
}

export async function getMyTeamService(userId: string) {
  const team = await prisma.team.findFirst({
    where: {
      captainUserId: userId,
    },
    include: {
      players: {
        include: {
          player: true,
        },
      },
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  return {
    name: team.name,
    logoUrl: team.logoUrl
      ? `http://localhost:4000/uploads/team-logos/${team.logoUrl}`
      : null,

    remainingBudget: Number(team.remainingBudget),

    players: team.players.map((player) => ({
      id: player.id,
      name: player.player.name,
      soldPrice: Number(player.soldPrice ?? 0),
      acquisitionType: player.acquisitionType,
    })),
  };
}