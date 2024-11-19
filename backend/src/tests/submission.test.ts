import test, { after, before, describe } from "node:test";
import request from "supertest";
import app from "../app";
import prisma from "../prisma/client";
import assert from "node:assert";
import { fetchAllQuestions } from "../services/questionService";
import { calculateScores } from "../services/scoreService";
import { Question } from "@prisma/client";

const generateAnswers = (questions: Question[], questionsCount: number) => {
  // all answers are right
  const answersJson: any = { "1": {} };
  for (let i = 0; i < questionsCount; i++) {
    const question = questions[i];
    answersJson["1"][question.id.toString()] = question.answer;
  }
  return answersJson;
};

describe("---- Submission Tests ----", async () => {
  const questions = await fetchAllQuestions();

  test("Score Calculation - When all are Right -", async () => {
    const questionsCount = 20;
    const score = calculateScores({
      answersJson: generateAnswers(questions, questionsCount),
      positiveScore: 1,
      negativeScore: 0,
      questions,
    });

    assert.strictEqual(score, questionsCount);
  });

  test("Submission Test #1 - All answers are right -", async () => {
    const submissionData = {
      quizId: 1,
      teamId: 1,
      userId: 1,
      answers: generateAnswers(questions, 20),
    };
    const res = await request(app).post("/user/submit").send(submissionData);
    assert.strictEqual(res.body.submission.score, 20);
  });
  
});
