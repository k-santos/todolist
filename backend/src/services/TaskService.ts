import { prismaClient } from "../lib/Client";

export class TaskService {
  async createTask(
    name: string,
    username: string | undefined,
    value?: number,
    unit?: string
  ) {
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
        userId: user.id,
      },
    });

    if (value && unit) {
      await prismaClient.complement.create({
        data: {
          value,
          unit,
          taskId: task.id,
        },
      });
    }

    return task;
  }

  async findTasks(username: string | undefined) {
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

    const tasks = await prismaClient.task.findMany({
      where: {
        userId: user.id,
      },
      include: {
        Complement: true,
        CompletedTask: {
          select: {
            id: true,
          },
        },
      },
    });

    return tasks;
  }

  async finishTask(taskId: string | undefined, value: number) {
    const completedTask = await prismaClient.completedTask.create({
      data: {
        taskId,
        value,
      },
    });
    return completedTask;
  }

  async undoTask(completedId: string) {
    const deleted = await prismaClient.completedTask.delete({
      where: {
        id: completedId,
      },
    });

    return deleted;
  }

  async findTask(taskId: string) {
    const task = await prismaClient.task.findUnique({
      where: {
        id: taskId,
      },
    });
    return task;
  }

  async findTaskFromCompletedId(completedId: string) {
    const completed = await prismaClient.completedTask.findUnique({
      where: {
        id: completedId,
      },
      include: {
        Task: true,
      },
    });
    const task = completed?.Task;
    return task;
  }
}
