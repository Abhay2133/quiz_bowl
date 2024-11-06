// src/routes/questionRoutes.ts
import express from 'express';
import { createQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion } from '../../controllers/questionController';

const router = express.Router();

// Route to create a new question
router.post('/questions', createQuestion);

// Route to get all questions
router.get('/questions', getQuestions);

// Route to get a specific question by its ID
router.get('/questions/:id', async (req: express.Request, res: express.Response) => {
  await getQuestionById(req, res)
});

// Error code
// router.get('/questions/:id', getQuestionById);

// Route to update a specific question by its ID
router.put('/questions/:id', updateQuestion);

// Route to delete a specific question by its ID
router.delete('/questions/:id', deleteQuestion);

export default router;
