// parent route /api/submissions*

import { Router } from "express";
import {
  getSubmissionById,
  getSubmissions,
  getSubmissionsByQuizCode,
} from "../../controllers/submissionController";

const router = Router();

// get all submissions
router.get("/submissions", getSubmissions);

// get submission by quizcode
router.get("/submissions/quizcode/:quizcode", (req, res) => {
  getSubmissionsByQuizCode(req, res);
});

router.get("/submissions/:id")

export default router;
