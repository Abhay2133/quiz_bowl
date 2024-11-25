import { Request, Response } from "express";
import { errorResponse } from "../utils/prisma";
import { uploadLiveAnswer } from "../services/liveQuizService";

export const submitLiveAnswer = async (req: Request, res: Response) => {
  const { liveQuizId, userId, answer, questionId } = req.body;
  try {
    const liveAnswer = await uploadLiveAnswer({
      liveQuizId,
      userId,
      answer,
      questionId,
    });
    res.json(liveAnswer);
  } catch (e) {
    errorResponse(e, res);
  }
};
