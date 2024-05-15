/*
  Warnings:

  - You are about to drop the column `complementId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId]` on the table `Complement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `taskId` to the `Complement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_complementId_fkey";

-- AlterTable
ALTER TABLE "Complement" ADD COLUMN     "taskId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "complementId";

-- CreateIndex
CREATE UNIQUE INDEX "Complement_taskId_key" ON "Complement"("taskId");

-- AddForeignKey
ALTER TABLE "Complement" ADD CONSTRAINT "Complement_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
