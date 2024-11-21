// src/routes/teamRoutes.ts
import express from "express";
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getTeamsByQuizId,
  createTeamWithUsers,
  createTeamWithUserS,
  addTeamToQuiz,
  removeTeamFromQuiz,
  getOtherTeams,
} from "../../controllers/teamController";

const router = express.Router();

router.post("/create-team", (a, b) => {
  createTeamWithUserS(a, b);
});
router.post("/teams", createTeam);
router.get("/teams", getTeams);
router.get("/teams/:id", getTeamById);
router.get("/teams/quiz/:quizId", getTeamsByQuizId);
router.get("/teams/not-quiz/:quizId", (a, b) => {
  getOtherTeams(a, b);
});
router.post("/teams/quiz/:quizId", (a, b) => {
  addTeamToQuiz(a, b);
});
router.delete("/teams/quiz/:quizId", (a, b) => {
  removeTeamFromQuiz(a, b);
});
router.put("/teams/:id", updateTeam);
router.delete("/teams/:id", deleteTeam);

export default router;
