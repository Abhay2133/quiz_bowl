import { Question } from "@prisma/client";
import prisma from "../prisma/client";

export const fetchAllQuestionsByRoundId = async (roundId: number) => {
  if (!roundId) throw new Error(`roundId (${roundId}) is invalid`);
  try {
    const questions = await prisma.question.findMany({ where: { roundId } });
    return questions;
  } catch (e: any) {
    console.log(e);
    return e;
  } finally {
  }
};

export async function fetchAllQuestions(): Promise<Question[]> {
  // if (!roundId) throw new Error(`roundId (${roundId}) is invalid`);
  try {
    const questions = await prisma.question.findMany();
    return questions;
  } catch (e: any) {
    console.log(e);
    throw e;
  } finally {
  }
}
