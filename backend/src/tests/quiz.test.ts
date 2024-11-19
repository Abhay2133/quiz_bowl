// seed the db before running these tests

import test, { after, describe } from "node:test";
import request from "supertest";
import app from "../app";
import assert from "node:assert";
import prisma from "../prisma/client";

describe("Question Test Cases", () => {
  const demoQuestion = {
    question: "Who is Abhay?",
    answer: "OPTION4",
    option1: "DEVELOPER",
    option2: "Student",
    option3: "Designer",
    option4: "All above",
    difficulty: "HARD",
    type: "TEXT",
    link: "",
    roundId: 1,
  };

  after(async () => {
    const question = await prisma.question.findMany({
      where: { question: demoQuestion.question },
    });
    if (question && question.length) {
      console.log("Cleaning Test Questions");
      await prisma.question.deleteMany({
        where: { question: demoQuestion.question },
      });
    }
  });

  test("POST /api/questions - Create Question - ", async () => {
    const res = await request(app).post("/api/questions").send(demoQuestion);
    // console.log(res.body);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(demoQuestion.question, res.body.question);
    assert.ok(res.body.id);
  });

  test("GET /api/questions - Get all Question -", async () => {
    const res = await request(app).get("/api/questions").send();
    // console.log(res.body);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body?.at(0)?.id);
  });
});
