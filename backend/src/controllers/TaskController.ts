import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { StatusCodes } from "http-status-codes";
import { TaskFactory } from "../factories/responses/taskFactory";
import { UserService } from "../services/UserService";
import {
  createTaskValidator,
  findTaskValidator,
  finishTaskValidator,
} from "./validations/TaskValidation";
export class TaskController {
  static async createTask(req: Request, res: Response) {
    const validationResult = createTaskValidator.safeParse(req.body);
    if (!validationResult.success) {
      return res.sendStatus(400);
    }
    const { name, value, unit } = req.body;
    const username = req.username;
    try {
      const taskService = new TaskService();
      const task = await taskService.createTask(name, username, value, unit);
      return res.status(StatusCodes.OK).json(task);
    } catch (error) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async findTasks(req: Request, res: Response) {
    try {
      const validationResult = findTaskValidator.safeParse(req.body);
      if (!validationResult.success) {
        return res.sendStatus(400);
      }
      const { date } = req.body;
      const username = req.username;
      const taskService = new TaskService();
      const tasksWithComplement = await taskService.findTasks(
        username,
        new Date(date)
      );
      const tasksResponse = TaskFactory.createTaskResponse(tasksWithComplement);
      return res.status(StatusCodes.OK).json(tasksResponse);
    } catch (error) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async findHistory(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const taskService = new TaskService();
      const history = await taskService.findHistory(taskId);
      return res.status(StatusCodes.OK).json(history);
    } catch (error) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async finishTask(req: Request, res: Response) {
    const validationResult = await finishTaskValidator.safeParseAsync(req.body);
    if (!validationResult.success) {
      return res.sendStatus(400);
    }
    const { taskId, value, date } = req.body;
    const username = req.username;
    const userService = new UserService();
    try {
      if (!username) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not found" });
      }
      const user = await userService.findUser(username);
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not found" });
      }
      const taskService = new TaskService();
      const task = await taskService.findTask(taskId);
      if (task?.userId != user.id) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User cannot finish task" });
      }
      const completedTask = await taskService.finishTask(
        taskId,
        new Date(date),
        parseInt(value)
      );
      if (!completedTask) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error" });
      }
      return res.status(StatusCodes.OK).json(completedTask);
    } catch (error) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async undoTask(req: Request, res: Response) {
    const username = req.username;
    const { completedId } = req.body;
    const userService = new UserService();
    try {
      if (!username) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not found" });
      }
      const user = await userService.findUser(username);
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User not found" });
      }
      const taskService = new TaskService();
      const task = await taskService.findTaskFromCompletedId(completedId);
      if (!task) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Task not found" });
      }
      if (task.userId != user.id) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "User cannot undo task" });
      }
      const deleted = await taskService.undoTask(completedId);
      if (!deleted) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error" });
      }
      return res.status(StatusCodes.OK).json(deleted);
    } catch (error) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
