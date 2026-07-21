import { z } from "zod";

export const startPlayerSchema = z.object({
  seasonPlayerId: z.string().uuid(),
});

export type StartPlayerAuctionInput = z.infer<typeof startPlayerSchema>;

export const placeBidSchema = z.object({
  teamId: z.string().uuid(),
});

export type PlaceBidInput = z.infer<typeof placeBidSchema>;

export const finishPlayerAuctionSchema = z.object({
  sold: z.boolean(),
});

export type FinishPlayerAuctionInput =
  z.infer<typeof finishPlayerAuctionSchema>;

export const getCurrentAuctionSchema = z.object({});
export type GetCurrentAuctionInput = z.infer<typeof getCurrentAuctionSchema>;

export const getBidHistorySchema = z.object({});
export type GetBidHistoryInput = z.infer<typeof getBidHistorySchema>;