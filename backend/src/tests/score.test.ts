import test, { after, before, describe } from "node:test";
import request from "supertest";
import app from "../app";
import prisma from "../prisma/client";
import assert from "node:assert";
import { fetchAllQuestions } from "../services/questionService";
import {
  calculateScores,
  setScoreBySubmissionData,
} from "../services/scoreService";

describe("Score Calculation Logic Tests", () => {
  test("Score Calculation - When all are Right -", async () => {
    const questions = await fetchAllQuestions();
    const questionsCount = 20;
    // all answers are right
    const answersJson: any = { "1": {} };
    for (let i = 0; i < questionsCount; i++) {
      const question = questions[i];
      answersJson["1"][question.id.toString()] = question.answer;
    }

    const score = calculateScores({
      answersJson,
      positiveScore: 1,
      negativeScore: 0,
      questions,
    });

    assert.strictEqual(score, questionsCount);
  });

  test("Score setting by Submission", async () => {
    const questions = await fetchAllQuestions();
    const questionsCount = 20;
    // all answers are right
    const answersJson: any = { "1": {} };
    for (let i = 0; i < questionsCount; i++) {
      const question = questions[i];
      answersJson["1"][question.id.toString()] = question.answer;
    }

    const _score = await setScoreBySubmissionData(prisma, {
      teamId: 1,
      userId: 1,
      quizId: 1,
      answers: JSON.stringify(answersJson),
    });

    assert.strictEqual(_score.quizId, 1);
  });
});
