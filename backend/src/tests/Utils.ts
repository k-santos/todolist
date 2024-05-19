import { prismaClient } from "../lib/Client";

export async function cleanDatabase() {
  await prismaClient.taskHistory.deleteMany();
  await prismaClient.complement.deleteMany();
  await prismaClient.task.deleteMany();
  await prismaClient.user.deleteMany();
}
