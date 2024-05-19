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

    return {
      id: task.id,
      name: task.name,
      value,
      unit,
      userId: task.userId,
    };
  }

  async findTasks(username: string | undefined, date: Date) {
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
        TaskHistory: {
          where: {
            date: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lte: new Date(date.setHours(23, 59, 59, 999)),
            },
          },
        },
      },
    });

    return tasks;
  }

  async findHistory(taskId: string) {
    const history = await prismaClient.taskHistory.findMany({
      where: {
        taskId,
      },
    });
    return history;
  }

  async finishTask(taskId: string, date: Date, value: number) {
    const historyTask = await prismaClient.taskHistory.create({
      data: {
        taskId,
        value,
        date,
      },
    });
    return historyTask;
  }

  async undoTask(historyId: string) {
    const deleted = await prismaClient.taskHistory.delete({
      where: {
        id: historyId,
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

  async findTaskFromHIstoryId(historyId: string) {
    const history = await prismaClient.taskHistory.findUnique({
      where: {
        id: historyId,
      },
      include: {
        Task: true,
      },
    });
    const task = history?.Task;
    return task;
  }
}
