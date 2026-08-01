import { prisma } from "../../../config/prisma";
import {
  StartPlayerAuctionInput,
  PlaceBidInput,
  FinishPlayerAuctionInput,
} from "../validations/liveAuction.validation";
import { getIO } from "../../../socket";
import { AUCTION_EVENTS } from "../../../socket/events";
import { startAuctionTimer } from "../socket/auctionTimer";

let countdown: NodeJS.Timeout | null = null;

const MAX_SQUAD_SIZE = 9;

function startCountdown() {
  if (countdown) {
    clearInterval(countdown);
  }

  let timeLeft = 10;

  const io = getIO();

  io.emit(AUCTION_EVENTS.TIMER, timeLeft);

  countdown = setInterval(async () => {
    timeLeft--;

    io.emit(AUCTION_EVENTS.TIMER, timeLeft);

    if (timeLeft <= 0) {
      clearInterval(countdown!);
      countdown = null;

      const season = await prisma.season.findFirst({
        where: {
          isActive: true,
        },
      });

      if (!season || !season.isPlayerLive) {
        return;
      }

      // SOLD
      if (season.currentBidTeamId) {
        await finishPlayerAuctionService({
          sold: true,
        });
      }

      // UNSOLD
      else {
        await finishPlayerAuctionService({
          sold: false,
        });
      }
    }
  }, 1000);
}

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

  startCountdown();

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

  const squadCount = await prisma.seasonPlayer.count({
  where: {
    seasonId: season.id,
    teamId: team.id,
  },
});

if (squadCount >= MAX_SQUAD_SIZE) {
  throw new Error("Team has already completed its squad");
}

  // Prevent the same team from bidding twice in a row
  if (season.currentBidTeamId === team.id) {
    throw new Error("You already have the highest bid");
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

  console.log("🔥 Emitting NEW_BID");

  io.emit(AUCTION_EVENTS.NEW_BID, {
    team: team.name,
    bidAmount: nextBid.toString(),
  });

  startCountdown();

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
  include: {
    player: true,
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
const winningTeam = await prisma.team.findUnique({
  where: {
    id: season.currentBidTeamId!,
  },
});

    await prisma.$transaction(async (tx) => {
      const io = getIO();

      io.emit(AUCTION_EVENTS.PLAYER_SOLD, {
  playerName: seasonPlayer.player.name,
  teamName: winningTeam?.name,
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

  const payload = {
  playerName: seasonPlayer.player.name,
};

console.log("UNSOLD EMIT:", payload);

const io = getIO();

io.emit(AUCTION_EVENTS.PLAYER_UNSOLD, payload);

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

  if (!season.isPlayerLive || !season.currentSeasonPlayerId) {
  return null;
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
  phoneNumber: seasonPlayer.player.phoneNumber,
  imageUrl: seasonPlayer.player.imageUrl
  ? `http://localhost:4000/uploads/players/${seasonPlayer.player.imageUrl}`
  : null,

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

  if (!season.isPlayerLive || !season.currentSeasonPlayerId) {
  return [];
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
  }));
}

export async function getRemainingPlayersService() {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  const players = await prisma.seasonPlayer.findMany({
    where: {
      seasonId: season.id,
      teamId: null,
    },
    include: {
      player: true,
    },
    orderBy: {
      player: {
        name: "asc",
      },
    },
  });

  return players.map((player) => ({
  id: player.id,
  name: player.player.name,
  phoneNumber: player.player.phoneNumber,
  imageUrl: player.player.imageUrl,
  basePrice: player.basePrice,
}));
}