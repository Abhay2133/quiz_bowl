// src/controllers/questionController.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { Question, QuestionType } from '@prisma/client';
import { shuffleArray } from '../utils/array';

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
    console.error(error);
    res.status(400).json({ error: 'Error creating question' });
  }
};

// Get all questions
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany();
    res.json(questions);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Error fetching question' });
  }
};

// Get a specific question by roundId
export const getQuestionByRoundId = async (req: Request, res: Response) => {
  const { roundId } = req.params;
  try {
    const questions = await prisma.question.findMany({
      where: { roundId: parseInt(roundId) },
    });
    if (!questions) {
      return res.status(404).json({ error: 'Questions not found' });
    }
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching questions' });
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
    console.error(error);
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
    console.error(error);
    res.status(404).json({ error: 'Question not found' });
  }
};

// const roundQcache:{[key:string]: {easyQ:number[], mediumQ:number[], }} = {};

// generate questions for users
export const generateRound = async (req: Request, res: Response) => {
  try {
    const roundId = parseInt(req.params.roundId);
    // const questions = 
    const round = await prisma.round.findUnique({ where: { id: roundId } });
    if (!round) return res.status(404).json({ error: `no round (id:${roundId}) found` });
    const { easyQ, mediumQ, hardQ } = round;
    const easyQuestions = shuffleArray(await prisma.question.findMany({ where: { roundId, difficulty: "EASY" } })).slice(0, easyQ).map(toUserQ)
    const mediumQuestions = shuffleArray(await prisma.question.findMany({ where: { roundId, difficulty: "MEDIUM" } })).slice(0, mediumQ).map(toUserQ)
    const hardQuestions = shuffleArray(await prisma.question.findMany({ where: { roundId, difficulty: "HARD" } })).slice(0, hardQ).map(toUserQ)

    return res.json([...easyQuestions, ...mediumQuestions, ...hardQuestions])
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Error generating test", message: e.message });
  }
}

const toUserQ = (q: Question) => {
  const userQ: any = { ...q };
  delete userQ.answer;
  return userQ
}

export const getUserQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const question = await prisma.question.findUnique({ where: { id: parseInt(id) } });
    if (!question) return res.status(404).json({ error: `Question not found (id:${id})` })

    res.json(toUserQ(question));
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: `Error getting question (id:${id})`, message: e.message })
  }
}
