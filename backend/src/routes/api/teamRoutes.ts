// src/routes/teamRoutes.ts
import express from 'express';
import { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, getTeamsByQuizId } from '../../controllers/teamController';

const router = express.Router();

router.post('/teams', createTeam);
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.get("/teams/quiz/:id", getTeamsByQuizId);
router.put('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);

export default router;
