import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { StatusCodes } from "http-status-codes";
export class TaskController {
  static async createTask(req: Request, res: Response) {
    const { name, type } = req.body;
    const username = req.username;
    const taskService = new TaskService();
    const task = await taskService.createTask(name, type, username);
    return res.status(StatusCodes.OK).json(task);
  }
}
