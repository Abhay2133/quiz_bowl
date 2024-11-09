import { Request, Response } from "express";
import prisma from "../prisma/client";

// post test submission
export const submitTest = async (req: Request, res: Response) => {
  const { testId, teamId, userId, answers } = req.body;

  try {
    // Verify that the test, team, and user exist
    const test = await prisma.test.findUnique({ where: { id: testId } });
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
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
        testId,
        teamId,
        userId,
        answers, // Store answers as JSON format, assuming they are already formatted as [{ questionId: answer }]
        submittedAt: new Date(),
      },
    });

    res.status(201).json({ message: "Submission successful", submission });
  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ error: "An error occurred while submitting the test" });
  }
};
