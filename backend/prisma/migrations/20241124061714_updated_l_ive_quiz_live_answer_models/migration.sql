/*
  Warnings:

  - You are about to drop the column `quizcode` on the `LiveQuiz` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `LiveQuiz` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[liveQuizcode]` on the table `LiveQuiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `liveQuizcode` to the `LiveQuiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `LiveQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LiveQuiz" DROP COLUMN "quizcode",
ADD COLUMN     "liveQuizcode" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LiveQuiz_name_key" ON "LiveQuiz"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LiveQuiz_liveQuizcode_key" ON "LiveQuiz"("liveQuizcode");
