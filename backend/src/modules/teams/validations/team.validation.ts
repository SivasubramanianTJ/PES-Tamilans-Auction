import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters"),

  logoUrl: z
    .string()
    .url("Invalid logo URL")
    .optional(),
});

export type CreateTeamInput =
  z.infer<typeof createTeamSchema>;