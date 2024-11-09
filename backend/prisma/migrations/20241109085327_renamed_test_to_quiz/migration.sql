/*
  Warnings:

  - You are about to drop the column `testId` on the `Round` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quizId` to the `Round` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_testId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_testId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_testId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_testId_fkey";

-- AlterTable
ALTER TABLE "Round" DROP COLUMN "testId",
ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "testId",
ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "testId",
ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "testId",
ADD COLUMN     "quizId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quizcode" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTiming" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_name_key" ON "Quiz"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_quizcode_key" ON "Quiz"("quizcode");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
