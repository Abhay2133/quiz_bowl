// src/routes/quizRoutes.ts
import express from "express";
import {
  createQuiz,
  getQuizs,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getNotLive_Quizs,
} from "../../controllers/quizController";

const router = express.Router();

// Route to create a quiz
router.post("/quizs", createQuiz);

// Route to get all quizs
router.get("/quizs", getQuizs);

// Route to get a specific quiz by its ID
// router.get('/quizs/:id', getQuizById);
router.get(
  "/quizs/:id",
  async (req: express.Request, res: express.Response) => {
    await getQuizById(req, res);
  }
);

// Route to update a specific quiz by its ID
router.put("/quizs/:id", updateQuiz);

// Route to delete a specific quiz by its ID
router.delete("/quizs/:id", deleteQuiz);

// get quiz which doesnot have live quizzes
router.get("/not-live-quizs", (a, b) => {
  getNotLive_Quizs(a, b);
});

export default router;
