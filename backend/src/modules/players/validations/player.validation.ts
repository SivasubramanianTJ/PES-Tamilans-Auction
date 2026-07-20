import { z } from "zod";

export const createPlayerSchema = z.object({
  name: z.string().trim().min(3).max(100),

  phoneNumber: z.string().trim().min(10).max(15),

  imageUrl: z.string().url().optional(),

  userId: z.string().uuid().optional(),
});

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;