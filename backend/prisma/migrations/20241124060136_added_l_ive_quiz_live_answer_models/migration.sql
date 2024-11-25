/*
  Warnings:

  - You are about to drop the column `negativeScore` on the `LiveQuiz` table. All the data in the column will be lost.
  - You are about to drop the column `positiveScore` on the `LiveQuiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LiveQuiz" DROP COLUMN "negativeScore",
DROP COLUMN "positiveScore";
