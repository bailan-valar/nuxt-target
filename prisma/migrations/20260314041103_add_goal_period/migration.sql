-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('YEAR', 'MONTH', 'WEEK');

-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "period_type" "PeriodType",
ADD COLUMN     "period_value" TEXT;
