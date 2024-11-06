// src/routes/roundRoutes.ts
import express from 'express';
import { createRound, getRoundsByTestId, getRoundById, updateRound, deleteRound } from '../../controllers/roundController';

const router = express.Router();

// Route to create a new round
router.post('/rounds', createRound);

// Route to get all rounds for a specific test
router.get('/rounds/test/:testId', getRoundsByTestId);

// Route to get a specific round by its ID
// router.get('/rounds/:id', getRoundById);
router.get('/rounds/:id', async (req: express.Request, res: express.Response) => {
  await getRoundById(req, res)
});

// Route to update a specific round by its ID
router.put('/rounds/:id', updateRound);

// Route to delete a specific round by its ID
router.delete('/rounds/:id', deleteRound);

export default router;
