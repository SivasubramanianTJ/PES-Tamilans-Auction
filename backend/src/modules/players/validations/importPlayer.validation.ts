import { z } from "zod";

export const importPlayerSchema = z.object({
  name: z.string().min(1, "Name is required"),

  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits"),

  imageFileName: z.string().min(1, "Image filename is required"),
});