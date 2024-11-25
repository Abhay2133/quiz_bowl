/*
  Warnings:

  - A unique constraint covering the columns `[quizId]` on the table `LiveQuiz` will be added. If there are existing duplicate values, this will fail.
  - Made the column `quizId` on table `LiveQuiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LiveQuiz" ALTER COLUMN "quizId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LiveQuiz_quizId_key" ON "LiveQuiz"("quizId");
