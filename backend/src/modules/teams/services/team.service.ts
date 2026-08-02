import { prisma } from "../../../config/prisma.js";
import { CreateTeamInput } from "../validations/team.validation.js";

export async function createTeam(
  data: CreateTeamInput
) {
    const season = await prisma.season.findFirst({
  where: {
    isActive: true,
  },
});

if (!season) {
  throw new Error("No active season found");
}

const existingTeam = await prisma.team.findFirst({
  where: {
    seasonId: season.id,
    name: data.name,
  },
});

if (existingTeam) {
  throw new Error("Team already exists");
}

  const team = await prisma.team.create({
  data: {
    seasonId: season.id,

    name: data.name,

    logoUrl: data.logoUrl,

    captainUserId: null,

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
  ? `import.meta.env.VITE_API_URL/uploads/team-logos/${team.logoUrl}`
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
      ? `import.meta.env.VITE_API_URL/uploads/team-logos/${team.logoUrl}`
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

export async function assignCaptainService(
  teamId: string,
  captainUserId: string
) {
  // Check team exists
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.captainUserId) {
  throw new Error("Team already has a captain assigned");
}

  // Check captain exists
  const captain = await prisma.user.findUnique({
    where: {
      id: captainUserId,
    },
  });

  if (!captain) {
    throw new Error("Captain not found");
  }

  if (captain.role !== "CAPTAIN") {
    throw new Error("Selected user is not a captain");
  }

  // Check whether captain is already assigned
  const existingTeam = await prisma.team.findFirst({
    where: {
      captainUserId,
    },
  });

  if (existingTeam) {
    throw new Error("Captain is already assigned to another team");
  }

  // Assign captain
  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      captainUserId,
    },
  });

  return updatedTeam;
}

export async function getAllTeamsService() {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  return prisma.team.findMany({
    where: {
      seasonId: season.id,
    },
    include: {
      captain: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function deleteTeamService(teamId: string) {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.captainUserId) {
    throw new Error("Remove captain before deleting team");
  }

  const playerCount = await prisma.seasonPlayer.count({
    where: {
      teamId,
    },
  });

  if (playerCount > 0) {
    throw new Error("Cannot delete team with players");
  }

  await prisma.team.delete({
    where: {
      id: teamId,
    },
  });

  return {
    message: "Team deleted successfully",
  };
}

export async function getAvailableCaptainsService() {
  const captains = await prisma.user.findMany({
    where: {
      role: "CAPTAIN",
      captainedTeams: {
        none: {},
      },
    },

    select: {
      id: true,
      fullName: true,
      username: true,
    },

    orderBy: {
      fullName: "asc",
    },
  });

  return captains;
}

export async function removeCaptainService(teamId: string) {

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (!team.captainUserId) {
    throw new Error("Team has no captain");
  }

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      captainUserId: null,
    },
  });

  return updatedTeam;
}