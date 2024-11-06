// src/controllers/testController.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Create a new test
export const createTest = async (req: Request, res: Response) => {
  const { name, duration, startTiming, date, testcode } = req.body;
  try {
    const test = await prisma.test.create({
      data: { name, duration, startTiming, date, testcode },
    });
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: 'Error creating test' });
  }
};

// Get all tests
export const getTests = async (req: Request, res: Response) => {
  try {
    const tests = await prisma.test.findMany();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tests' });
  }
};

// Get a test by ID
export const getTestById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const test = await prisma.test.findUnique({ where: { id: parseInt(id) } });
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching test' });
  }
};

// Update a test
export const updateTest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, duration, startTiming, date } = req.body;
  try {
    const updatedTest = await prisma.test.update({
      where: { id: parseInt(id) },
      data: { name, duration, startTiming, date },
    });
    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ error: 'Error updating test' });
  }
};

// Delete a test
export const deleteTest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.test.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Test not found' });
  }
};
