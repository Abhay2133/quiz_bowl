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
} from "../../controllers/teamController";

const router = express.Router();

router.post("/create-team", (a, b) => {
  createTeamWithUserS(a, b);
});
router.post("/teams", createTeam);
router.get("/teams", getTeams);
router.get("/teams/:id", getTeamById);
router.get("/teams/quiz/:quizId", getTeamsByQuizId);
router.put("/teams/:id", updateTeam);
router.delete("/teams/:id", deleteTeam);

export default router;
