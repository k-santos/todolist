import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { StatusCodes } from "http-status-codes";

export class UserController {
  static async create(req: Request, res: Response) {
    const { username, password } = req.body;
    const userService = new UserService();
    await userService.createUser(username, password);
    return res.sendStatus(StatusCodes.CREATED);
  }
}
