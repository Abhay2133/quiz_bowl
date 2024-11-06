// src/routes/teamRoutes.ts
import express from 'express';
import { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, getTeamsByTestId } from '../../controllers/teamController';

const router = express.Router();

router.post('/teams', createTeam);
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.get("/teams/test/:id", getTeamsByTestId);
router.put('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);

export default router;
