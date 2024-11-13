import { Request, Response } from "express";
import prisma from "../prisma/client";
import { errorResponse } from "../utils/prisma";

// Post quiz submission
export const submitQuiz = async (req: Request, res: Response) => {
  const { quizId, teamId, userId, answers } = req.body;

  if (
    quizId == undefined ||
    teamId == undefined ||
    userId == undefined ||
    answers == undefined
  ) {
    console.log(req.body);
    return res.status(400).json({
      error: `Data not in format ({ quizId, teamId, userId, answers })`,
    });
  }

  try {
    // Verify that the quiz, team, and user exist
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!quiz) {
      console.log(`Quiz not found (quizId: ${quizId})`);
      return res.status(404).json({ error: "Quiz not found" });
    }
    if (!team) {
      console.log(`Team not found (teamId: ${teamId})`);
      return res.status(404).json({ error: "Team not found" });
    }
    if (!user) {
      console.log(`User not found (userId: ${userId})`);
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new submission
    const submission = await prisma.submission.create({
      data: {
        quizId,
        teamId,
        userId,
        answers, // Store answers as JSON format, assuming they are already formatted as [{ questionId: answer }]
        // submittedAt: new Date(),
      },
    });

    res.status(201).json({ message: "Submission successful", submission });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    // res.status(500).json({ error: "An error occurred while submitting the quiz" });
    errorResponse(error, res);
  }
};

// Get all submissions
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany();
    res.json(submissions);
  } catch (e: any) {
    errorResponse(e, res);
  }
};

// Get submission by quiz code
export const getSubmissionByQuizCode = async (req: Request, res: Response) => {
  const { quizcode } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { quizcode },
      include: { submissions: true },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz.submissions);
  } catch (e: any) {
    errorResponse(e, res);
  }
};

// Get submission by user email
export const getSubmissionByUserEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { submissions: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.submissions);
  } catch (e: any) {
    errorResponse(e, res);
  }
};

// Get submission by submission ID
export const getSubmissionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const submission = await prisma.submission.findUnique({
      where: { id: parseInt(id) },
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json(submission);
  } catch (e: any) {
    errorResponse(e, res);
  }
};

// Update submission
export const updateSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { answers } = req.body;

  try {
    const updatedSubmission = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: { answers, updatedAt: new Date() },
    });

    res.json({ message: "Submission updated successfully", updatedSubmission });
  } catch (e: any) {
    errorResponse(e, res);
  }
};

// Delete submission
export const deleteSubmission = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.submission.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Submission deleted successfully" });
  } catch (e: any) {
    errorResponse(e, res);
  }
};
