import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { errorResponse } from "../utils/prisma";
import {
  _createLiveQuizByQuizcode,
  fetchLiveQuestion,
  generateLeaderboard,
  getLiveQuizInfoByEmailQuizcode,
} from "../services/liveQuizService";
import { fetchAllQuestions } from "../services/questionService";

const prisma = new PrismaClient();

// Create a LiveQuiz
export const createLiveQuiz = async (req: Request, res: Response) => {
  try {
    const {
      liveQuizcode,
      quizData,
      activeRoundIndex,
      activeQuestionIndex,
      isAnswerAllowed,
      status,
      timeLimit,
      positiveScore,
      quizId,
      negativeScore,
      name,
    } = req.body;
    const liveQuiz = await prisma.liveQuiz.create({
      data: {
        name,
        liveQuizcode,
        quizData,
        activeRoundIndex,
        activeQuestionIndex,
        isAnswerAllowed,
        status,
        quizId,
        timeLimit,
        positiveScore,
        negativeScore,
      },
    });
    res.status(201).json(liveQuiz);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create LiveQuiz", details: error });
  }
};

// Get all LiveQuizzes
export const getAllLiveQuizzes = async (req: Request, res: Response) => {
  try {
    const liveQuizzes = await prisma.liveQuiz.findMany({
      select: {
        id: true,
        name: true,
        liveQuizcode: true,
        activeRoundIndex: true,
        activeQuestionIndex: true,
        isAnswerAllowed: true,
        status: true,
        timeLimit: true,
        quizId: true,
        negativeScore: true,
        createdAt: true,
        updatedAt: true,
        positiveScore: true,
      },
    });
    res.status(200).json(liveQuizzes);
  } catch (error) {
    errorResponse(error, res);
  }
};

// Get a single LiveQuiz by ID
export const getLiveQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const liveQuiz = await prisma.liveQuiz.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!liveQuiz) {
      return res.status(404).json({ error: "LiveQuiz not found" });
    }
    res.status(200).json(liveQuiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LiveQuiz", details: error });
  }
};

// Update a LiveQuiz
export const updateLiveQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      liveQuizcode,
      name,
      quizData,
      activeRoundIndex,
      activeQuestionIndex,
      isAnswerAllowed,
      status,
      timeLimit,
      positiveScore,
      negativeScore,
      quizId,
    } = req.body;

    const liveQuiz = await prisma.liveQuiz.update({
      where: { id: parseInt(id, 10) },
      data: {
        liveQuizcode,
        quizId,
        name,
        quizData,
        activeRoundIndex,
        activeQuestionIndex,
        isAnswerAllowed,
        status,
        timeLimit,
        positiveScore,
        negativeScore,
      },
    });
    res.status(200).json(liveQuiz);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update LiveQuiz", details: error });
  }
};

// Delete a LiveQuiz
export const deleteLiveQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.liveQuiz.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(200).json({ message: "LiveQuiz deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete LiveQuiz", details: error });
  }
};

// creaet live quiz by quizcode
export const createLiveQuizByQuizcode = async (req: Request, res: Response) => {
  const { quizcode } = req.body;
  try {
    const liveQuiz = await _createLiveQuizByQuizcode(quizcode);
    res.status(201).json(liveQuiz);
  } catch (e: any) {
    console.error(e);
    errorResponse(e, res);
  }
};

// get live quiz by quizcode
export const getLiveQuizByQuizcode = (req: Request, res: Response) => {
  const { quizcode } = req.params;
  try {
  } catch (e: any) {
    errorResponse(e, res);
  }
};

export const getLiveQuizInfo = async (req: Request, res: Response) => {
  const { email, quizcode } = req.body;
  if (!email.trim() || !quizcode.trim())
    return res
      .status(400)
      .json({ error: `email (${email}) or quizcode (${quizcode}) missing` });
  try {
    const liveQuiz = await getLiveQuizInfoByEmailQuizcode(email, quizcode);
    return res.json(liveQuiz);
  } catch (e: any) {
    errorResponse(e, res);
  }
};

export const getLiveQuestion = async (req: Request, res: Response) => {
  const { liveQuizId, userId } = req.body;
  if (!liveQuizId || !userId)
    return res.status(400).json({
      error: `liveQuizd(${liveQuizId}) or userId(${userId}) is missing`,
    });
  try {
    const question = await fetchLiveQuestion(
      parseInt(liveQuizId),
      parseInt(userId)
    );
    return res.json(question);
  } catch (error) {
    console.error(error);
    errorResponse(error, res);
  }
};

export const generateLiveLeaderboard = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ message: `invalid ID in /api/liveQuizzes/:ID/leaderboard` });
  try {
    const questions = await fetchAllQuestions();
    const leaderboard = await generateLeaderboard(parseInt(id), questions);
    return res.json(leaderboard);
  } catch (e) {
    console.error(e);
    errorResponse(e, res);
  }
};
