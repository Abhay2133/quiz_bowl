// src/controllers/roundController.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Create a new round
export const createRound = async (req: Request, res: Response) => {
  const { testId, name, easyQ, mediumQ, hardQ } = req.body;
  try {
    const round = await prisma.round.create({
      data: { testId, name, easyQ, mediumQ, hardQ },
    });
    res.status(201).json(round);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: 'Error creating round', message: error.message });
  }
};

// Get all rounds for a specific test
export const getRoundsByTestId = async (req: Request, res: Response) => {
  const { testId } = req.params;
  try {
    const rounds = await prisma.round.findMany({ where: { testId: parseInt(testId) } });
    res.json(rounds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching rounds' });
  }
};

// Get a specific round by ID
export const getRoundById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const round = await prisma.round.findUnique({ where: { id: parseInt(id) } });
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    res.json(round);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching round' });
  }
};

// Update a round by ID
export const updateRound = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { testId, name, easyQ, mediumQ, hardQ } = req.body;
  try {
    const updatedRound = await prisma.round.update({
      where: { id: parseInt(id) },
      data: { testId, name, easyQ, mediumQ, hardQ },
    });
    res.json(updatedRound);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error updating round' });
  }
};

// Delete a round by ID
export const deleteRound = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.round.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Round not found' });
  }
};


// get round by testcode
export const getRoundByTestCode = async (req: Request, res: Response) => {
  const { testcode } = req.params;
  try {
    const rounds = await prisma.round.findMany({ where: { test: { testcode } } });
    if (!rounds) {
      return res.status(404).json({ error: 'Round not found' });
    }
    const userRounds = rounds.map(item=> {id:item.id})
    res.json(userRounds );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching round' });
  }
};