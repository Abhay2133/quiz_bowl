// src/controllers/quizController.ts
import { Request, Response } from "express";
import prisma from "../prisma/client";

// Create a new quiz
export const createQuiz = async (req: Request, res: Response) => {
  const { name, duration, startTiming, date, quizcode } = req.body;
  try {
    const quiz = await prisma.quiz.create({
      data: { name, duration, startTiming, date, quizcode },
    });
    res.status(201).json(quiz);
  } catch (error: any) {
    console.error(error);
    res
      .status(400)
      .json({ error: "Error creating quiz", message: error.message });
  }
};

// Get all quizs
export const getQuizs = async (req: Request, res: Response) => {
  try {
    const quizs = await prisma.quiz.findMany();
    res.json(quizs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching quizs" });
  }
};

// Get a quiz by ID
export const getQuizById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const quiz = await prisma.quiz.findUnique({ where: { id: parseInt(id) } });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching quiz" });
  }
};

// Update a quiz
export const updateQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, duration, startTiming, date } = req.body;
  try {
    const updatedQuiz = await prisma.quiz.update({
      where: { id: parseInt(id) },
      data: { name, duration, startTiming, date },
    });
    res.json(updatedQuiz);
  } catch (error: any) {
    console.error(error);
    res
      .status(400)
      .json({ error: "Error updating quiz", message: error.message });
  }
};

// Delete a quiz
export const deleteQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.quiz.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error Deleting quiz", message: error.message });
  }
};

// get quiz by quizcode
export const getQuizByQuizcode = async (req: Request, res: Response) => {
  const { quizcode } = req.params;
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { quizcode },
      include: { rounds: true },
    });
    if (!quiz)
      return res
        .status(404)
        .json({ error: "no quiz found by quizcode : " + quizcode });
    // const userquiz: any = { ...quiz };
    // delete userquiz.createdAt;
    // delete userquiz.updatedAt;
    res.status(200).json(quiz);
  } catch (e: any) {
    console.error(e);
    res
      .status(500)
      .json({
        error: `Error fetching quiz by quizcode "${quizcode}"`,
        message: e.message,
      });
  }
};

// post quiz submission
export const postSubmissionBy = async (req: Request, res: Response) => {};

// get all data of quiz i.e., quiz > (team > user , rounds) > questions
export const getAllDataByQuizId = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const data = await prisma.quiz.findUnique({
      where: { id },
      include: {
        rounds: { include: { questions: true } },
        submissions: true,
        teams: true,
      },
    });

    res.json(data);
  } catch (e: any) {
    console.error(e);
    res
      .status(500)
      .json({ error: "failed to query test data", message: e.message });
  }
};
