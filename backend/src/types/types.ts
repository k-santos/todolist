import { Prisma } from "@prisma/client";

const taskWithComplement = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: {
    Complement: true,
    CompletedTask: true,
  },
});

export type TaskWitComplement = Prisma.TaskGetPayload<
  typeof taskWithComplement
>;
