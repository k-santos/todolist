import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { StatusCodes } from "http-status-codes";
import { TaskFactory } from "../factories/responses/taskFactory";
export class TaskController {
  static async createTask(req: Request, res: Response) {
    const { name, value, unit } = req.body;
    const username = req.username;
    const taskService = new TaskService();
    const task = await taskService.createTask(name, username, value, unit);
    return res.status(StatusCodes.OK).json(task);
  }

  static async findTasks(req: Request, res: Response) {
    const username = req.username;
    const taskService = new TaskService();
    const tasksWithComplement = await taskService.findTasks(username);
    const tasksResponse = TaskFactory.createTaskResponse(tasksWithComplement);
    return res.status(StatusCodes.OK).json(tasksResponse);
  }
}
