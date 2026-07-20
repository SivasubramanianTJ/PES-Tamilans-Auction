-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "currentBid" BIGINT,
ADD COLUMN     "currentBidTeamId" TEXT,
ADD COLUMN     "currentSeasonPlayerId" TEXT,
ADD COLUMN     "isPlayerLive" BOOLEAN NOT NULL DEFAULT false;
