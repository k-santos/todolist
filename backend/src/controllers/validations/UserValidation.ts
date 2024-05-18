import { z } from "zod";

export const createUserValidator = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(8),
});

export const loginValidator = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});
