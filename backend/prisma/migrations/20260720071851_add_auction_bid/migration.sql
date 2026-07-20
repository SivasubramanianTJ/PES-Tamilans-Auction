-- CreateTable
CREATE TABLE "AuctionBid" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "seasonPlayerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "bidAmount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuctionBid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuctionBid_seasonId_idx" ON "AuctionBid"("seasonId");

-- CreateIndex
CREATE INDEX "AuctionBid_seasonPlayerId_idx" ON "AuctionBid"("seasonPlayerId");

-- CreateIndex
CREATE INDEX "AuctionBid_teamId_idx" ON "AuctionBid"("teamId");

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_seasonPlayerId_fkey" FOREIGN KEY ("seasonPlayerId") REFERENCES "SeasonPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
