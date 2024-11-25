import { Request, Response } from "express";
import {
  ANSWER,
  LiveAnswer,
  LiveQuiz,
  PrismaClient,
  Question,
} from "@prisma/client";
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
      timeLimit: 20, // Default value; you can customize it as needed
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

  const liveAnswer = await prisma.liveAnswer.findFirst({
    where: { userId, questionId: question.id },
  });
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
  teamId,
}: {
  liveQuizId: number;
  userId: number;
  answer: ANSWER;
  questionId: number;
  teamId: number;
}) => {
  const liveQuiz = await prisma.liveQuiz.findUnique({
    where: { id: liveQuizId },
  });
  if (!liveQuiz) throw new Error(`Live Quiz does exists (id:${liveQuizId})`);
  if (!liveQuiz.isAnswerAllowed) throw new Error(`Answer window closed`);

  const liveAnswer = await prisma.liveAnswer.findFirst({
    where: { AND: [{ userId }, { questionId }, { liveQuizId }] },
  });
  if (liveAnswer) throw new Error(`Question already answered`);

  const _liveAnswer = await prisma.liveAnswer.create({
    data: {
      liveQuizId,
      userId,
      answer,
      questionId,
      teamId,
    },
  });

  return _liveAnswer;
};

export const generateLeaderboard = async (
  liveQuizId: number,
  questions: Question[]
) => {
  const liveQuiz = await prisma.liveQuiz.findUnique({
    where: { id: liveQuizId },
  });
  if (!liveQuiz) throw new Error(`Invalid liveQuizId(${liveQuizId})`);

  const quiz = await prisma.quiz.findUnique({ where: { id: liveQuiz.quizId } });
  const liveAnswers = await prisma.liveAnswer.findMany({
    where: { liveQuizId },
  });
  const teams = (
    await prisma.teamQuiz.findMany({
      where: { quizId: quiz?.id },
      include: { team: true },
    })
  ).map((val) => val.team);

  const scores = teams.reduce((pre: any, curr) => {
    pre[curr.id] = 0;
    return pre;
  }, {});

  const { positiveScore, negativeScore } = liveQuiz;

  liveAnswers.forEach((liveAnswer) => {
    const { answer, teamId, questionId } = liveAnswer;
    const mark =
      questions.find((q) => q.id == questionId)?.answer == answer
        ? positiveScore
        : 0 - negativeScore;
    scores[teamId] += mark;
  });

  const leaderboard = Object.entries(scores).map((kvPair:any)=>{
    const [teamId, score] = kvPair;
    return {team: teams.find(team=>team.id == teamId)?.name, score};
  })

  return leaderboard;
};
