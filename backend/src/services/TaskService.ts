import { Type } from "@prisma/client";
import { prismaClient } from "../lib/Client";

export class TaskService {
  async createTask(name: string, type: Type, username: string | undefined) {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const task = await prismaClient.task.create({
      data: {
        name,
        type,
        userId: user.id,
      },
    });
    return task;
  }
}
