// src/routes/testRoutes.ts
import express from 'express';
import { createTest, getTests, getTestById, updateTest, deleteTest } from '../../controllers/testController';

const router = express.Router();

// Route to create a test
router.post('/tests', createTest);

// Route to get all tests
router.get('/tests', getTests);

// Route to get a specific test by its ID
// router.get('/tests/:id', getTestById);
router.get('/tests/:id', async (req: express.Request, res: express.Response) => {
  await getTestById(req, res)
});

// Route to update a specific test by its ID
router.put('/tests/:id', updateTest);

// Route to delete a specific test by its ID
router.delete('/tests/:id', deleteTest);

export default router;
