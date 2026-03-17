/*
  Warnings:

  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "PeriodType" ADD VALUE 'TASK';

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_goal_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_fkey";

-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "next_execution" TIMESTAMP(3),
ADD COLUMN     "planned_end" TIMESTAMP(3),
ADD COLUMN     "planned_start" TIMESTAMP(3);

-- DropTable
DROP TABLE "tasks";

-- DropEnum
DROP TYPE "TaskPriority";
