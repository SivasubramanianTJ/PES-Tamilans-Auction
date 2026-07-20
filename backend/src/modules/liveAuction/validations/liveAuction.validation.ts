import { z } from "zod";

export const startPlayerSchema = z.object({
  seasonPlayerId: z.string().uuid(),
});

export type StartPlayerAuctionInput = z.infer<typeof startPlayerSchema>;