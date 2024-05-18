import { z } from "zod";

export const createTaskValidator = z
  .object({
    name: z.string().min(1),
    value: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .transform(Number)
      .or(z.number())
      .optional(),
    unit: z.string().optional(),
  })
  .refine((data) => {
    if (data.value !== undefined || data.unit !== undefined) {
      if (data.value === undefined || data.unit === undefined) {
        return false;
      }
    }
    return true;
  });
