/*
  Warnings:

  - Added the required column `roundId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionCount` to the `Round` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "roundId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "questionCount" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
