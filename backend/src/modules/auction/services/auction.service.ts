import { prisma } from "../../../config/prisma";

export async function startAuction() {
  // Business Rule 1: There must be an active season
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  // Business Rule 2: Auction must not already be started
  if (season.status === "AUCTION") {
    throw new Error("Auction is already running");
  }

  // Start the auction
  const updatedSeason = await prisma.season.update({
    where: {
      id: season.id,
    },
    data: {
      status: "AUCTION",
      auctionStartedAt: new Date(),
    },
  });

  return updatedSeason;
}