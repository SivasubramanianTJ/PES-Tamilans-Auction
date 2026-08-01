import { z } from "zod";

export const retentionSchema = z.object({
  seasonPlayerId: z.string().uuid(),

  teamId: z.string().uuid(),

  soldPrice: z.coerce.bigint(),
});

export type RetentionInput =
  z.infer<typeof retentionSchema>;