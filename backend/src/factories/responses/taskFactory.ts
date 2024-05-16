import { TaskWitComplement } from "../../types/types";

interface TaskResponse {
  id: string;
  name: string;
  complement?: string;
  idCompletedToday?: string;
}

export class TaskFactory {
  static createTaskResponse(tasks: TaskWitComplement[]): TaskResponse[] {
    const response: TaskResponse[] = [];
    for (const task of tasks) {
      let complement: string | undefined = undefined;
      if (task.Complement) {
        complement = `${task.Complement.value} ${task.Complement.unit}`;
      }
      response.push({
        id: task.id,
        name: task.name,
        complement,
        idCompletedToday: task.CompletedTask[0]?.id,
      });
    }
    return response;
  }
}
