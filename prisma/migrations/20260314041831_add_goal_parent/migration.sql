-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "parent_id" TEXT;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
