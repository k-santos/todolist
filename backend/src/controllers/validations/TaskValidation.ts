import { z } from "zod";
import { prismaClient } from "../../lib/Client";

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

export const findTaskValidator = z.object({
  date: z.string().pipe(z.coerce.date()),
});

export const undoTaskValidator = z
  .object({
    historyId: z.string(),
  })
  .refine(async (data) => {
    const history = await prismaClient.taskHistory.findUnique({
      where: {
        id: data.historyId,
      },
    });
    if (!history) {
      return false;
    }
    return true;
  });

export const finishTaskValidator = z
  .object({
    date: z.string().pipe(z.coerce.date()),
    taskId: z.string(),
    value: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .transform(Number)
      .or(z.number())
      .optional(),
  })
  .refine(async (data) => {
    const task = await prismaClient.task.findUnique({
      where: {
        id: data.taskId,
      },
      include: {
        Complement: true,
      },
    });
    if (!task) {
      return false;
    }
    if (task.Complement?.value && !data.value) {
      return false;
    }
    return true;
  });
