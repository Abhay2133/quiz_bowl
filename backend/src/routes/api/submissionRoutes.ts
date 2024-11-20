// parent route /api/submissions*

import { Router } from "express";
import {
  deleteSubmission,
  getAllSubmissions,
  getSubmissionById,
  getSubmissions,
  getSubmissionsByQuizCode,
} from "../../controllers/submissionController";

const router = Router();

// get all submissions
router.get("/submissions", getAllSubmissions);
// router.get("/namedSubmissions", getSubmissions);
// router.get("/all-submission")

// get submission by quizcode
router.get("/submissions/quizcode/:quizcode", (req, res) => {
  getSubmissionsByQuizCode(req, res);
});

router.get("/submissions/:id")
router.delete("/submissions/:id", deleteSubmission);

export default router;
