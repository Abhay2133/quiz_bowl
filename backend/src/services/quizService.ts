import { Question, Round } from "@prisma/client";
import prisma from "../prisma/client";
import { shuffleArray } from "../utils/array";

export const generateQuiz = async (
  quizcode: string,
  includeAnswers?: boolean
) => {
  const quiz = await prisma.quiz.findUnique({
    where: { quizcode },
    include: { rounds: { include: { questions: true } } },
  });

  if (!quiz) throw Error(`Quiz not found (quizcode:${quizcode})`);

  const quizData = {
    quizcode,
    rounds: Array<any>(),
  };
  for (const round of quiz.rounds) {
    quizData.rounds.push(generateRound(round, includeAnswers));
  }
  return quizData;
};

const generateRound = (
  round: Round & { questions: Question[] },
  includeAnswers?: boolean
) => {
  // filtering questions based on difficulty
  // then checking if we have enough questions
  const easyQs = round.questions
    .filter((q) => q.difficulty == "EASY")
    .map((q) => ({
      id: q.id,
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      type: q.type,
      link: q.link,
      answer: includeAnswers ? q.answer : null,
    }));

  if (easyQs.length < round.easyQ)
    throw new Error(
      `Less no. of easy questions (required:${round.easyQ}) (got:${easyQs.length}) (round:${round.name})`
    );

  const mediumQs = round.questions
    .filter((q) => q.difficulty == "MEDIUM")
    .map((q) => ({
      id: q.id,
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      type: q.type,
      link: q.link,
      answer: includeAnswers ? q.answer : null,
    }));

  if (mediumQs.length < round.mediumQ)
    throw new Error(
      `Less no. of Mediums questions (required:${round.mediumQ}) (got:${mediumQs.length}) (round:${round.name})`
    );

  const hardQs = round.questions
    .filter((q) => q.difficulty == "HARD")
    .map((q) => ({
      id: q.id,
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      type: q.type,
      link: q.link,
      answer: includeAnswers ? q.answer : null,
    }));

  if (hardQs.length < round.hardQ)
    throw new Error(
      `Less no. of hard questions (required:${round.hardQ}) (got:${hardQs.length}) (round:${round.name})`
    );

  return {
    id: round.id,
    name: round.name,
    questions: shuffleArray([
      ...shuffleArray(easyQs).slice(0, round.easyQ),
      ...shuffleArray(mediumQs).slice(0, round.mediumQ),
      ...shuffleArray(hardQs).slice(0, round.hardQ),
    ]),
  };
};
