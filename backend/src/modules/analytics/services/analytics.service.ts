import { prisma } from "../../../config/prisma.js";

export async function getAuctionAnalytics() {

  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season");
  }

  const totalPlayers = await prisma.seasonPlayer.count({
    where: {
      seasonId: season.id,
    },
  });

  const soldPlayers = await prisma.seasonPlayer.count({
    where: {
      seasonId: season.id,
      teamId: {
        not: null,
      },
    },
  });

  const remainingPlayers = await prisma.seasonPlayer.count({
    where: {
      seasonId: season.id,
      teamId: null,
    },
  });

  const highestBid = await prisma.seasonPlayer.findFirst({
    where: {
      seasonId: season.id,
      soldPrice: {
        not: null,
      },
    },
    include: {
      player: true,
      team: true,
    },
    orderBy: {
      soldPrice: "desc",
    },
  });

  const teams = await prisma.team.findMany({
  where: {
    seasonId: season.id,
  },
  include: {
    captain: true,

    players: {
      include: {
        player: true,
      },
    },
  },
});

  return {
    summary: {
      totalPlayers,
      soldPlayers,
      remainingPlayers,
    },

    highestBid: highestBid
      ? {
          player: highestBid.player.name,
          team: highestBid.team?.name,
          price: highestBid.soldPrice,
        }
      : null,

    teams: teams.map((team) => {

  const retained = team.players.filter(
    p => p.acquisitionType === "RETENTION"
  ).length;

  const auction = team.players.filter(
    p => p.acquisitionType === "AUCTION"
  ).length;

  const spent = team.players.reduce(
    (sum, p) => sum + Number(p.soldPrice ?? 0),
    0
  );

  return {

    id: team.id,

    name: team.name,

    captain: team.captain?.fullName,

//    captainOnline: team.captain?.isOnline,

    remainingBudget: team.remainingBudget,

    totalSpent: spent,

    squadSize: team.players.length,

    retentions: retained,

    auctionPlayers: auction,

    players: team.players.map(player => ({

      name: player.player.name,

      acquisitionType: player.acquisitionType,

      soldPrice: player.soldPrice,

    })),
  };

}),
  };
}