import test, { after, before, describe } from "node:test";
import request from "supertest";
import app from "../app";
import prisma from "../prisma/client";
import assert from "node:assert";

describe("Authenticaton Tests", () => {

  test("User Login", async () => {
    const response = await request(app).post("/auth/user").send({
      email: "bob@example.com",
      quizcode: "FESTLA-2024",
    });

    assert.strictEqual(response.status, 200);
    assert.ok(response.body.token);

    // console.log("BODY:",response.body);
  });

});
