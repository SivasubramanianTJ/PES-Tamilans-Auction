import { prisma } from "../../../config/prisma";
import { StartPlayerAuctionInput } from "../validations/liveAuction.validation";

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