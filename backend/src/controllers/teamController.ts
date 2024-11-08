// src/controllers/teamController.ts (similar structure for testController.ts, roundController.ts, and questionController.ts)
import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Create a new team
export const createTeam = async (req: Request, res: Response) => {
  const { name, testId } = req.body;
  try {
    const team = await prisma.team.create({ data: { name, testId } });
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: 'Error creating team' });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teams' });
  }
};

// Get a team by ID
export const getTeamById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findUnique({ where: { id: parseInt(id) } });
    res.json(team);
  } catch (error) {
    res.status(404).json({ error: 'Team not found' });
  }
};

// Get a team by testid
export const getTeamsByTestId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const teams = await prisma.team.findMany({ where: { testId: parseInt(id) } });
    res.json(teams);
  } catch (error) {
    res.status(404).json({ error: 'No team found in current Test' });
  }
};

// Update a Team
export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, testId } = req.body;
  try {
    const updatedTeam = await prisma.team.update({
      where: { id: parseInt(id) },
      data: { name, testId },
    });
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ error: 'Error updating team' });
  }
};

// Delete a team
export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.team.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Team not found' });
  }
};
