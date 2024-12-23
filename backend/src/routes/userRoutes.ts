// parent routes : /user/*

import { Router } from "express";
// import quizRoutes from "./quizRoutes"
import {
  generateQuiz,
  getQuizByQuizcode,
  getQuizInfo,
} from "../controllers/quizController";
import { getRoundsByQuizId } from "../controllers/roundController";
import {
  generateRound,
  getUserQuestion,
} from "../controllers/questionController";
import { submitQuiz } from "../controllers/submissionController";
import {
  getLiveQuestion,
  getLiveQuizInfo,
} from "../controllers/liveQuizController";
import { submitLiveAnswer } from "../controllers/liveAnswerController";

const router = Router();

// get quiz details for user
router.get("/quiz/:quizcode", (req, res) => {
  getQuizByQuizcode(req, res);
});

// get quiz info
router.post("/quizInfo", (req, res) => {
  getQuizInfo(req, res);
});

// get rounds details for user
router.get("/rounds/quiz/:quizId", (req, res) => {
  getRoundsByQuizId(req, res);
});

// get list of questions for a quiz round
router.get("/questions/round/:roundId", (req, res) => {
  generateRound(req, res);
});

// get a single question for a user
router.get("/questions/:id", (req, res) => {
  getUserQuestion(req, res);
});

// submit quiz
router.post("/submit", (req, res) => {
  submitQuiz(req, res);
});

// generate quiz
router.get("/generate-quiz/:quizcode", (req, res) => {
  generateQuiz(req, res);
});

// ------------ ROUTES FOR LIVE QUIZ ----------------

router.post("/liveQuizInfo", (req, res) => {
  getLiveQuizInfo(req, res);
});

router.post("/liveQuestion", (req, res) => {
  getLiveQuestion(req, res);
});

router.post("/liveAnswer", (req, res)=>{
  submitLiveAnswer(req, res);
})

export default router;
