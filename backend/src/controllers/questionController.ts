// src/controllers/questionController.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Create a new question
export const createQuestion = async (req: Request, res: Response) => {
  const { question, answer, option1, option2, option3, option4, type, link, difficulty, roundId } = req.body;
  try {
    const newQuestion = await prisma.question.create({
      data: {
        question,
        answer,
        option1,
        option2,
        option3,
        option4,
        type,
        link,
        difficulty,
        roundId
      },
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: 'Error creating question' });
  }
};

// Get all questions
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
};

// Get a specific question by ID
export const getQuestionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) },
    });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching question' });
  }
};

// Update a question by ID
export const updateQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, answer, option1, option2, option3, option4, type, link, difficulty } = req.body;
  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        question,
        answer,
        option1,
        option2,
        option3,
        option4,
        type,
        link,
        difficulty
      },
    });
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ error: 'Error updating question' });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.question.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Question not found' });
  }
};
