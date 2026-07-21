import { prisma } from "../../../config/prisma";
import {
  StartPlayerAuctionInput,
  PlaceBidInput,
  FinishPlayerAuctionInput,
} from "../validations/liveAuction.validation";
import { getIO } from "../../../socket";
import { AUCTION_EVENTS } from "../../../socket/events";

export async function startPlayerAuctionService(
  data: StartPlayerAuctionInput
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
    throw new Error("Season player not found");
  }

  if (!seasonPlayer.season.isActive) {
    throw new Error("Season is not active");
  }

  if (seasonPlayer.season.status !== "AUCTION") {
    throw new Error("Auction has not started");
  }

  await prisma.season.update({
    where: {
      id: seasonPlayer.seasonId,
    },
    data: {
      currentSeasonPlayerId: seasonPlayer.id,
      currentBid: seasonPlayer.basePrice,
      currentBidTeamId: null,
      isPlayerLive: true,
    },
  });

  const io = getIO();

io.emit(AUCTION_EVENTS.START_PLAYER, {
  player: seasonPlayer.player.name,
  basePrice: seasonPlayer.basePrice.toString(),
});

  return seasonPlayer;
}

export async function placeBidService(
  data: PlaceBidInput
) {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  if (!season.isPlayerLive) {
    throw new Error("No player is currently live");
  }

  if (!season.currentSeasonPlayerId) {
    throw new Error("Current player not found");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: data.teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const nextBid =
    (season.currentBid ?? BigInt(0)) + season.bidIncrement;

  if (team.remainingBudget < nextBid) {
    throw new Error("Insufficient remaining budget");
  }

  await prisma.auctionBid.create({
    data: {
      seasonId: season.id,
      seasonPlayerId: season.currentSeasonPlayerId,
      teamId: team.id,
      bidAmount: nextBid,
    },
  });

  await prisma.season.update({
    where: {
      id: season.id,
    },
    data: {
      currentBid: nextBid,
      currentBidTeamId: team.id,
    },
  });

  const io = getIO();

io.emit(AUCTION_EVENTS.NEW_BID, {
  team: team.name,
  bidAmount: nextBid.toString(),
});

  return {
    team: team.name,
    bidAmount: nextBid,
  };
}

export async function finishPlayerAuctionService(
  data: FinishPlayerAuctionInput
) {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  if (!season.isPlayerLive) {
    throw new Error("No player is currently live");
  }

  if (!season.currentSeasonPlayerId) {
    throw new Error("No current player found");
  }

  const seasonPlayer = await prisma.seasonPlayer.findUnique({
    where: {
      id: season.currentSeasonPlayerId,
    },
  });

  if (!seasonPlayer) {
    throw new Error("Season player not found");
  }

  // Cannot sell without a bidder
  if (data.sold && !season.currentBidTeamId) {
    throw new Error("Cannot sell player without any bids");
  }

  // SOLD
  if (data.sold) {
    await prisma.$transaction(async (tx) => {
       const io = getIO();

io.emit(AUCTION_EVENTS.PLAYER_SOLD, {
  playerId: seasonPlayer.id,
  teamId: season.currentBidTeamId,
  soldPrice: season.currentBid?.toString(),
});
      await tx.seasonPlayer.update({
        where: {
          id: seasonPlayer.id,
        },
        data: {
          teamId: season.currentBidTeamId!,
          soldPrice: season.currentBid,
          acquisitionType: "AUCTION",
        },
      });

      await tx.team.update({
        where: {
          id: season.currentBidTeamId!,
        },
        data: {
          remainingBudget: {
            decrement: season.currentBid!,
          },
        },
      });

      await tx.season.update({
        where: {
          id: season.id,
        },
        data: {
          currentSeasonPlayerId: null,
          currentBid: null,
          currentBidTeamId: null,
          isPlayerLive: false,
        },
      });
    });

    return {
      message: "Player sold successfully",
    };
  }

  // UNSOLD
  await prisma.season.update({
    where: {
      id: season.id,
    },
    data: {
      currentSeasonPlayerId: null,
      currentBid: null,
      currentBidTeamId: null,
      isPlayerLive: false,
    },
  });

  const io = getIO();

io.emit(AUCTION_EVENTS.PLAYER_UNSOLD, {
  playerId: seasonPlayer.id,
});

  return {
    message: "Player marked as unsold",
  };
}

export async function getCurrentAuctionService() {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  if (!season.isPlayerLive) {
    throw new Error("No player is currently live");
  }

  if (!season.currentSeasonPlayerId) {
    throw new Error("Current player not found");
  }

  const seasonPlayer = await prisma.seasonPlayer.findUnique({
    where: {
      id: season.currentSeasonPlayerId,
    },
    include: {
      player: true,
    },
  });

  if (!seasonPlayer) {
    throw new Error("Season player not found");
  }

  let currentTeam = null;

  if (season.currentBidTeamId) {
    const team = await prisma.team.findUnique({
      where: {
        id: season.currentBidTeamId,
      },
    });

    currentTeam = team?.name ?? null;
  }

  return {
    player: seasonPlayer.player.name,
    basePrice: seasonPlayer.basePrice,
    currentBid: season.currentBid,
    currentTeam,
    isPlayerLive: season.isPlayerLive,
  };
}

export async function getBidHistoryService() {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  if (!season.isPlayerLive) {
    throw new Error("No player is currently live");
  }

  if (!season.currentSeasonPlayerId) {
    throw new Error("Current player not found");
  }

  const bids = await prisma.auctionBid.findMany({
    where: {
      seasonPlayerId: season.currentSeasonPlayerId,
    },
    include: {
      team: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return bids.map((bid) => ({
    team: bid.team.name,
    bidAmount: bid.bidAmount,
    //createdAt: bid.createdAt,
  }));
}