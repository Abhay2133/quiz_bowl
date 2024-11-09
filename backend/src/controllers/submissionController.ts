import { Request, Response } from "express";
import prisma from "../prisma/client";

// post quiz submission
export const submitQuiz = async (req: Request, res: Response) => {
  const { quizId, teamId, userId, answers } = req.body;

  if (!(quizId && teamId && userId && answers)) return res.status(400).json({ error: `data not in format ({ quizId, teamId, userId, answers })` })
  try {
    // Verify that the quiz, team, and user exist
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new submission
    const submission = await prisma.submission.create({
      data: {
        quizId,
        teamId,
        userId,
        answers, // Store answers as JSON format, assuming they are already formatted as [{ questionId: answer }]
        submittedAt: new Date(),
      },
    });

    res.status(201).json({ message: "Submission successful", submission });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "An error occurred while submitting the quiz" });
  }
};
