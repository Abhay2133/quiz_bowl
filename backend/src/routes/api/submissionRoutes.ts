// parent route /api/submissions

import { Router } from "express";
import {
  getSubmissionById,
  getSubmissions,
} from "../../controllers/submissionController";

const router = Router();

// get all submissions
router.get("/", getSubmissions);

// get submission by quizcode
router.get("/quizcode/:quizcode", (req, res) => {
  getSubmissionById(req, res);
});

export default router;
