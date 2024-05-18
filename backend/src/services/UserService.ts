import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../lib/Client";
import { User } from "@prisma/client";

export class UserService {
  async createUser(name: string, username: string, password: string) {
    const encryptedPass = await bcrypt.hash(password, 10);
    await prismaClient.user.create({
      data: {
        name,
        username,
        password: encryptedPass,
      },
    });
  }

  async login(user: User, password: string) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET!,
        {
          expiresIn: "10m",
        }
      );
      return token;
    }
    return undefined;
  }

  async findUser(username: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  }
}
