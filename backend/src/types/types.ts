import { Prisma } from "@prisma/client";

const taskWithComplementAndHistory = Prisma.validator<Prisma.TaskDefaultArgs>()(
  {
    include: {
      Complement: true,
      TaskHistory: true,
    },
  }
);

export type TaskWitComplementAndHistory = Prisma.TaskGetPayload<
  typeof taskWithComplementAndHistory
>;
