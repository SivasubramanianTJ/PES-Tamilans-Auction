-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('SETUP', 'AUCTION', 'LIVE', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "seasonNumber" INTEGER NOT NULL,
    "auctionDate" TIMESTAMP(3) NOT NULL,
    "seasonStartDate" TIMESTAMP(3) NOT NULL,
    "seasonEndDate" TIMESTAMP(3) NOT NULL,
    "auctionStartedAt" TIMESTAMP(3),
    "auctionEndedAt" TIMESTAMP(3),
    "status" "SeasonStatus" NOT NULL DEFAULT 'SETUP',
    "teamCount" INTEGER NOT NULL,
    "teamBudget" BIGINT NOT NULL,
    "squadSize" INTEGER NOT NULL,
    "basePlayerPrice" BIGINT NOT NULL,
    "bidIncrement" BIGINT NOT NULL,
    "retentionLimit" INTEGER NOT NULL,
    "rtmLimit" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Season_seasonNumber_key" ON "Season"("seasonNumber");
