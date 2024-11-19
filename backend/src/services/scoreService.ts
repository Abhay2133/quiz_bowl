import { JsonObject } from "@prisma/client/runtime/library";
import { fetchAllQuestions } from "./questionService";
import { Question, Quiz } from "@prisma/client";
import prisma from "../prisma/client";

export const calculateScores = ({
  answersJson,
  positiveScore,
  negativeScore,
  questions,
}: {
  questions: Question[];
  answersJson: JsonObject;
  positiveScore: number;
  negativeScore: number;
}) => {
  // const questions = await fetchAllQuestions();
  let score = 0;
  for (let roundId in answersJson) {
    const answers = answersJson[roundId] as JsonObject;
    for (let questionId in answers) {
      let answer = answers[questionId]+"";
      answer = answer.startsWith("OPTION") ? answer : "OPTION" + answer;
      if (!answer) continue;
      if (
        answer == questions?.find((q) => q?.id.toString() == questionId)?.answer
      ) {
        score += positiveScore;
      } else {
        score -= negativeScore;
      }
    }
  }
  return score;
};

export const setScoreBySubmissionData = async (
  _prisma: any,
  {
    teamId,
    userId,
    quizId,
    answers,
  }: {
    teamId?: number;
    userId: number;
    quizId: number;
    answers: any;
  }
) => {
  try {
    const answersJson =
      typeof answers == "string" ? JSON.parse(answers) : answers;
    const questions = await fetchAllQuestions();
    const { positiveScore, negativeScore } = (await prisma.quiz.findUnique({
      where: { id: quizId },
    })) as Quiz;

    const score = calculateScores({
      positiveScore,
      negativeScore,
      answersJson,
      questions,
    });

    let _prisma_ = _prisma || prisma;
    const _score = await _prisma_.score.create({
      data: {
        quizId,
        score,
        userId,
      },
    });

    return _score;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
};

// export const setScore = async ({quizId, userId, }) => {

// }
