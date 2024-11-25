-- CreateEnum
CREATE TYPE "LiveQuizStatus" AS ENUM ('NOT_STARTED', 'ACTIVE', 'FINISHED');

-- CreateTable
CREATE TABLE "LiveQuiz" (
    "id" SERIAL NOT NULL,
    "quizcode" TEXT NOT NULL,
    "quizData" JSONB NOT NULL,
    "activeRoundIndex" INTEGER NOT NULL DEFAULT -1,
    "activeQuestionIndex" INTEGER NOT NULL DEFAULT -1,
    "isAnswerAllowed" BOOLEAN NOT NULL DEFAULT false,
    "status" "LiveQuizStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "timeLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveAnswer" (
    "id" SERIAL NOT NULL,
    "liveQuizId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answer" "ANSWER" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiveAnswer" ADD CONSTRAINT "LiveAnswer_liveQuizId_fkey" FOREIGN KEY ("liveQuizId") REFERENCES "LiveQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAnswer" ADD CONSTRAINT "LiveAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
