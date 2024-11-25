import { Request, Response } from "express";
import { ANSWER, LiveQuiz, PrismaClient } from "@prisma/client";
import { generateQuiz } from "./quizService";

const prisma = new PrismaClient();

/**
 *
 * Wrap this function with try catch and use 'errorResponse' function in catch block
 */
export async function _createLiveQuizByQuizcode(
  quizcode: string
): Promise<LiveQuiz> {
  // Fetch Quiz by quizcode
  const quiz = await prisma.quiz.findUnique({
    where: { quizcode },
  });

  if (!quiz) throw Error(`Quiz not found (quizcode:${quizcode})`);

  // Generate quizData using the generateQuiz function
  const quizData = await generateQuiz(quizcode);

  // Create a new LiveQuiz
  const liveQuiz = await prisma.liveQuiz.create({
    data: {
      liveQuizcode: `live-${quiz.quizcode}`,
      name: `Live ${quiz.name}`,
      quizData,
      activeRoundIndex: -1,
      activeQuestionIndex: -1,
      isAnswerAllowed: false,
      status: "NOT_STARTED",
      timeLimit: 0, // Default value; you can customize it as needed
      positiveScore: quiz.positiveScore,
      negativeScore: quiz.negativeScore,
      quizId: quiz.id,
    },
  });

  return liveQuiz;
}

export const getLiveQuizInfoByEmailQuizcode = async (
  email: string,
  quizcode: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.teamId) throw new Error(`User not in a team`);
  const team = await prisma.team.findUnique({ where: { id: user.teamId } });

  if (!team)
    throw Error(`Team (id:${user.teamId}) not found with user (${user.email})`);

  // Find the quiz by quiz code
  const quiz = await prisma.quiz.findUnique({
    where: { quizcode },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Find the live quiz information
  const liveQuiz = await prisma.liveQuiz.findUnique({
    where: { quizId: quiz.id },
    select: {
      id: true,
      name: true,
      liveQuizcode: true,
      // quizData: true,
      // activeRoundIndex: true,
      // activeQuestionIndex: true,
      // isAnswerAllowed: true,
      status: true,
      timeLimit: true,
      positiveScore: true,
      negativeScore: true,
    },
  });

  if (!liveQuiz) {
    throw new Error("Live quiz not found");
  }

  return {
    ...liveQuiz,
    teamName: team?.name,
    userName: user.name,
    teamId: team?.id,
    quizcode: quiz.quizcode,
    userId: user.id,
  };
};

export const fetchLiveQuestion = async (liveQuizId: number, userId: number) => {
  const liveQuiz = await prisma.liveQuiz.findUnique({
    where: { id: liveQuizId },
  });
  if (!liveQuiz) throw new Error(`Live Quiz not found (id:${liveQuizId})`);
  const { quizData, activeQuestionIndex, activeRoundIndex } = liveQuiz;

  const question = (quizData as any).rounds[activeRoundIndex].questions[
    activeQuestionIndex
  ];

  const liveAnswer = await prisma.liveAnswer.findFirst({ where: { userId } });
  const answered = !!liveAnswer;
  const selectedAnswer = liveAnswer ? liveAnswer.answer : "";

  return {
    ...question,
    answered,
    selectedAnswer,
    index: activeQuestionIndex + 1,
  };
};

export const uploadLiveAnswer = async ({
  liveQuizId,
  userId,
  answer,
  questionId,
}: {
  liveQuizId: number;
  userId: number;
  answer: ANSWER;
  questionId: number;
}) => {
  const liveAnswer = await prisma.liveAnswer.findFirst({
    where: { AND: [{ userId }, { questionId }, { liveQuizId }] },
  });
  if (liveAnswer) throw new Error(`Questoin already answered`);

  const _liveAnswer = await prisma.liveAnswer.create({
    data: {
      liveQuizId,
      userId,
      answer,
      questionId,
    },
  });

  return _liveAnswer;
};
