-- CreateEnum
CREATE TYPE "AcquisitionType" AS ENUM ('CAPTAIN', 'RETENTION', 'AUCTION', 'RTM', 'UNSOLD_ASSIGNMENT');

-- CreateTable
CREATE TABLE "SeasonPlayer" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT,
    "basePrice" BIGINT NOT NULL,
    "soldPrice" BIGINT,
    "acquisitionType" "AcquisitionType",
    "isRetentionEligible" BOOLEAN NOT NULL DEFAULT false,
    "isRTMEligible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeasonPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeasonPlayer_seasonId_playerId_key" ON "SeasonPlayer"("seasonId", "playerId");

-- AddForeignKey
ALTER TABLE "SeasonPlayer" ADD CONSTRAINT "SeasonPlayer_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonPlayer" ADD CONSTRAINT "SeasonPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonPlayer" ADD CONSTRAINT "SeasonPlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
