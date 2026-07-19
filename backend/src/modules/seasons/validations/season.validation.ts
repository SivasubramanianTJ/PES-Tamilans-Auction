import { z } from "zod";

export const createSeasonSchema = z.object({
  name: z.string().min(3).max(100),

  description: z.string().min(3).max(500),

  seasonNumber: z.number().int().positive(),

  auctionDate: z.string().datetime(),

  seasonStartDate: z.string().datetime(),

  seasonEndDate: z.string().datetime(),

  teamCount: z.number().int().positive(),

  teamBudget: z.number().positive(),

  squadSize: z.number().int().positive(),

  basePlayerPrice: z.number().positive(),

  bidIncrement: z.number().positive(),

  retentionLimit: z.number().int().min(0),

  rtmLimit: z.number().int().min(0),
});

export type CreateSeasonInput = z.infer<typeof createSeasonSchema>;