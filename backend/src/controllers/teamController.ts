// src/controllers/teamController.ts (similar structure for quizController.ts, roundController.ts, and questionController.ts)
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Team } from "@prisma/client";
import { errorResponse } from "../utils/prisma";

// Create a new team
export const createTeam = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const team = await prisma.team.create({ data: { name } });
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: "Error creating team" });
  }
};

// create team with 2 users
export const createTeamWithUsers = async (req: Request, res: Response) => {
  const { name, user1name, user2name, user1email, user2email, quizId } =
    req.body;
  try {
    await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name,
        },
      });
      if (!team)
        return res
          .status(501)
          .json({ error: `failed to create team (${name})` });

      const user1 = { name: user1name, email: user1email, teamId: team.id };
      const user2 = { name: user2name, email: user2email, teamId: team.id };

      const users = await prisma.user.createMany({
        data: [user1, user2],
      });


      res.status(201).json(team);
    });
  } catch (error) {
    res.status(400).json({ error: "Error creating team" });
  }
};
/**
 * Controller to create a new team with two users.
 */
export const createTeamWithUserS = async (req: Request, res: Response) => {
  try {
    const { name, user1name, user2name, user1email, user2email } = req.body;

    // Validate input
    if (!name || !user1name || !user2name || !user1email || !user2email) {
      return res.status(400).json({
        error: "Team name, user names, and user emails are required.",
      });
    }

    // Ensure unique emails for the two users
    if (user1email === user2email) {
      return res.status(400).json({
        error: "Users must have unique email addresses.",
      });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the team
      const team = await prisma.team.create({
        data: {
          name: name,
        },
      });

      // Create two users and associate them with the team
      const users = await prisma.user.createMany({
        data: [
          { name: user1name, email: user1email, teamId: team.id },
          { name: user2name, email: user2email, teamId: team.id },
        ],
      });

      return { team, users };
    });

    return res.status(201).json({
      message: "Team created successfully!",
      team: result.team,
    });
  } catch (error: any) {
    console.error("Error creating team:", error);

    // Handle unique constraint errors
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "One or both email addresses are already in use.",
      });
    }

    return res.status(500).json({
      error: "An unexpected error occurred while creating the team.",
    });
  }
};


export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Error fetching teams" });
  }
};

// Get a team by ID
export const getTeamById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findUnique({ where: { id: parseInt(id) } });
    res.json(team);
  } catch (error) {
    res.status(404).json({ error: "Team not found" });
  }
};

// Get a team by quizid
export const getTeamsByQuizId = async (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  try {
    const teamquiz = await prisma.teamQuiz.findMany({
      where: { quizId },
      select: { team: true },
    });
    const teams: Team[] = teamquiz.map((i) => i.team);
    res.json(teams);
  } catch (error) {
    errorResponse(error, res);
    res.status(404).json({ error: "No team found in current Quiz" });
  }
};

// Update a Team
export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedTeam = await prisma.team.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ error: "Error updating team" });
  }
};

// Delete a team
export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Team not found" });
  }
};
