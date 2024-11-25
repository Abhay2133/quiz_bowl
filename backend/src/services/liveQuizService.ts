import { Request, Response } from "express";
import { LiveQuiz, PrismaClient } from "@prisma/client";
import { generateQuiz } from "./quizService";

const prisma = new PrismaClient();

/**
 * 
 * Wrap this function with try catch and use 'errorResponse' function in catch block
 */
export async function _createLiveQuizByQuizcode(quizcode: string) : Promise<LiveQuiz> {
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
