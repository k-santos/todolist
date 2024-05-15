/*
  Warnings:

  - You are about to drop the column `type` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "type",
DROP COLUMN "value",
ADD COLUMN     "complementId" TEXT;

-- DropEnum
DROP TYPE "Type";

-- CreateTable
CREATE TABLE "Complement" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "Complement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_complementId_fkey" FOREIGN KEY ("complementId") REFERENCES "Complement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
