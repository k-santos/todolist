import bcrypt from "bcrypt";
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
}
