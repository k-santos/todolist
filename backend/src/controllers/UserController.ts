import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { StatusCodes } from "http-status-codes";
import {
  createUserValidator,
  loginValidator,
} from "./validations/UserValidation";

export class UserController {
  static async create(req: Request, res: Response) {
    const validationResult = createUserValidator.safeParse(req.body);
    if (!validationResult.success) {
      return res.sendStatus(400);
    }
    const { name, username, password } = req.body;
    const userService = new UserService();
    try {
      await userService.createUser(name, username, password);
      return res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async login(req: Request, res: Response) {
    const validationResult = loginValidator.safeParse(req.body);
    if (!validationResult.success) {
      return res.sendStatus(400);
    }
    const { username, password } = req.body;
    const userService = new UserService();
    try {
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
      return res.status(StatusCodes.OK).json({ token, name: user.name });
    } catch (error) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
