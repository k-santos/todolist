import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../lib/Client";

export class UserService {
  async createUser(username: string, password: string) {
    const encryptedPass = await bcrypt.hash(password, 10);
    await prismaClient.user.create({
      data: {
        username,
        password: encryptedPass,
      },
    });
  }

  async login(username: string, password: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
          expiresIn: "10m",
        });
        return token;
      }
    }
  }
}
