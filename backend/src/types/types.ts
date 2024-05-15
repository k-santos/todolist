import { Prisma } from "@prisma/client";

const taskWithComplement = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: {
    Complement: true,
  },
});

export type TaskWitComplement = Prisma.TaskGetPayload<
  typeof taskWithComplement
>;
