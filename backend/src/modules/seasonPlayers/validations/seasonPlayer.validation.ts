import { z } from "zod";

export const createSeasonPlayerSchema = z.object({
  playerId: z.string().uuid(),

  basePrice: z.number().positive(),

  isRetentionEligible: z.boolean().default(false),

  isRTMEligible: z.boolean().default(false),
});

export type CreateSeasonPlayerInput = z.infer<
  typeof createSeasonPlayerSchema
>;