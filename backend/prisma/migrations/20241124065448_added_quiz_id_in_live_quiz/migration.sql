-- AlterTable
ALTER TABLE "LiveQuiz" ADD COLUMN     "quizId" INTEGER;

-- AddForeignKey
ALTER TABLE "LiveQuiz" ADD CONSTRAINT "LiveQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
