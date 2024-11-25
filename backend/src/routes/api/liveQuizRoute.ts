// parent route /api/*

import { Router } from "express";
import {
  createLiveQuiz,
  getAllLiveQuizzes,
  getLiveQuizById,
  updateLiveQuiz,
  deleteLiveQuiz,
  createLiveQuizByQuizcode,
  generateLiveLeaderboard,
} from "../../controllers/liveQuizController";

const router = Router();

router.post("/liveQuizzes", createLiveQuiz);
router.get("/liveQuizzes", getAllLiveQuizzes);
router.get("/liveQuizzes/:id", (a, b) => {
  getLiveQuizById(a, b);
});
router.put("/liveQuizzes/:id", updateLiveQuiz);
router.delete("/liveQuizzes/:id", deleteLiveQuiz);
router.post("/liveQuizzes/byQuizcode", createLiveQuizByQuizcode);
router.get("/liveQuizzes/:id/leaderboard", (a, b) => {
  generateLiveLeaderboard(a, b);
});
// router.get('/liveQuizzes/quizcode/:quizcode', )

export default router;
