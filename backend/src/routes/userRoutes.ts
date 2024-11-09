// parent routes : /user/*

import { Router } from "express";
// import quizRoutes from "./quizRoutes"
import { getQuizByQuizcode } from "../controllers/quizController";
import { getRoundsByQuizId } from "../controllers/roundController";
import { generateRound, getUserQuestion } from "../controllers/questionController";
import { submitQuiz } from "../controllers/submissionController";

const router = Router();

// get quiz details for user
router.get("/quiz/:quizcode", (req, res) => {
  getQuizByQuizcode(req, res);
});

// get rounds details for user
router.get("/rounds/quiz/:quizId", (req, res) => {
  getRoundsByQuizId(req, res);
})

// get list of questions for a quiz round
router.get("/questions/round/:roundId", (req, res) => {
  generateRound(req, res);
})

// get a single question for a user
router.get("/questions/:id", (req, res) => {
  getUserQuestion(req, res);
})

// submit quiz
router.post("/submit", (req, res) => {
  submitQuiz(req, res)
})

export default router