// parent routes : /user/*

import { Router } from "express";
// import testRoutes from "./testRoutes"
import { getTestByTestcode } from "../controllers/testController";
import { getRoundByTestCode, getRoundsByTestId } from "../controllers/roundController";
import { generateRound, getUserQuestion } from "../controllers/questionController";
import { submitTest } from "../controllers/submissionController";

const router = Router();

// get test details for user
router.get("/test/:testcode", (req, res) => {
  getTestByTestcode(req, res);
});

// get rounds details for user
router.get("/rounds/test/:testId", (req, res) => {
  getRoundsByTestId(req, res);
})

// get list of questions for a test round
router.get("/questions/round/:roundId", (req, res) => {
  generateRound(req, res);
})

// get a single question for a user
router.get("/questions/:id", (req, res) => {
  getUserQuestion(req, res);
})

// submit test
router.post("/submit", (req, res) => { 
  submitTest(req, res) 
})

export default router