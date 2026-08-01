import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username is required"),

  password: z
    .string()
    .min(6, "Password is required"),
});

export const createUserSchema = z.object({
  fullName: z.string().min(2),

  username: z.string().min(3),

  password: z.string().min(6),

  role: z.enum([
    "ADMIN",
    "CAPTAIN",
  ]),
});


export type CreateUserInput =
  z.infer<typeof createUserSchema>;

  export const assignCaptainSchema = z.object({
  teamId: z.string().uuid(),

  captainUserId: z.string().uuid(),
});

export type AssignCaptainInput =
  z.infer<typeof assignCaptainSchema>;
  
export type LoginInput = z.infer<typeof loginSchema>;