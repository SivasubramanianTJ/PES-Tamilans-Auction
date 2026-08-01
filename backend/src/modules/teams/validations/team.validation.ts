import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().optional(),
});

export const assignCaptainSchema = z.object({
  teamId: z.string().uuid(),
  captainUserId: z.string().uuid(),
});

export type CreateTeamInput =
  z.infer<typeof createTeamSchema>;

export type AssignCaptainInput =
  z.infer<typeof assignCaptainSchema>;