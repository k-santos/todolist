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

  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const userService = new UserService();
    const user = await userService.findUser(username);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not found" });
    }
    const token = await userService.login(user, password);
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }
    return res.status(StatusCodes.OK).json({ token });
  }
}
