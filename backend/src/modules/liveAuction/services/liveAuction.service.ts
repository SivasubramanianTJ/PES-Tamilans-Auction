import { prisma } from "../../../config/prisma";
import { StartPlayerAuctionInput } from "../validations/liveAuction.validation";

import { PlaceBidInput } from "../validations/liveAuction.validation";

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

  return seasonPlayer;
}

export async function placeBidService(
  data: PlaceBidInput
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

  if (!season.isPlayerLive) {
    throw new Error("No player is currently live");
  }

  if (!season.currentSeasonPlayerId) {
    throw new Error("Current player not found");
  }

  // Get team
  const team = await prisma.team.findUnique({
    where: {
      id: data.teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Calculate next bid
  const nextBid =
    (season.currentBid ?? BigInt(0)) + season.bidIncrement;

  // Check purse
  if (team.remainingBudget < nextBid) {
    throw new Error("Insufficient remaining budget");
  }

  // Save bid history
  await prisma.auctionBid.create({
    data: {
      seasonId: season.id,
      seasonPlayerId: season.currentSeasonPlayerId,
      teamId: team.id,
      bidAmount: nextBid,
    },
  });

  // Update live auction state
  await prisma.season.update({
    where: {
      id: season.id,
    },
    data: {
      currentBid: nextBid,
      currentBidTeamId: team.id,
    },
  });

  return {
    team: team.name,
    bidAmount: nextBid,
  };
}