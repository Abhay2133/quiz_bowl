import { Request, Response } from "express";
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";
import { comparePasswords, hashPassword } from "../utils/password";
import { Quiz } from "@prisma/client";

export async function userLogin(req: Request, res: Response) {
  const { email, quizcode } = req.body;
  if (!email || !quizcode)
    return res.status(400).json({
      error: `Incomplete data (email:${email}) (quizcode:${quizcode})`,
    });
  try {
    // const teamquiz = await prisma.teamQuiz.findUnique({include:})
    const quiz = await prisma.quiz.findUnique({ where: { quizcode } });
    if (!quiz) {
      console.log(`quizcode(${quizcode}) doesn't exists`);
      return res.status(401).json({ error: "quizcode doesn't exists" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user?.teamId)
      return res
        .status(401)
        .json({ error: `user email (${email}) isn't registered !` });

    const team = await prisma.team.findUnique({ where: { id: user.teamId } });
    if (!team) {
      console.error(`user emaill (${email}) doesn't exists in any team`);
      return res
        .status(401)
        .json({ error: "user emaill doesn't exists in any team" });
    }

    const teamquiz = await prisma.teamQuiz.findFirst({
      where: { teamId: team.id, quizId: quiz.id },
    });
    if (!teamquiz) {
      console.error(`team (${team.name}) is not in quiz (${quiz.name})`);
      return res
        .status(400)
        .json({ error: `team (${team.name}) is not in quiz (${quiz.name})` });
    }

    const token = generateToken({ userId: user?.id });
    return res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Login Failed", message: (error as any).message });
    console.error(error);
  }
}
// import { Request, Response } from "express";
// import { hashPassword, comparePasswords, generateToken } from "./authUtils"; // Replace with your actual utility imports
export async function adminLogin(req: Request, res: Response) {
  try {
    const { password = "" } = req.body;

    // Hash and compare the provided password with the stored admin password
    const hash = await hashPassword(process.env.ADMIN_PASSWORD || "ROOT");
    if (!(await comparePasswords(password, hash))) {
      return res.status(401).json({ error: "Wrong password" });
    }

    // Generate a JWT token for the admin
    const token = generateToken({ userId: process.env.ADMIN_ID || "admin" });

    // Respond with the token
    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Admin Login Failed",
      message: (error as any).message,
    });
  }
}
