import { Request, Response } from 'express'
import prisma from "../prisma/client";
import { generateToken } from '../utils/jwt';
import { comparePasswords, hashPassword } from '../utils/password';

export async function userLogin(req: Request, res: Response) {
  const { email, team, quizcode } = req.body;
  try {
    const user: any = await prisma.user.findUnique({
      where: {
        email,
        team: {
          quiz: {
            quizcode
          },
        },
      },
      include: {
        team: {
          include: {
            quiz: true, // Include the quiz details if needed
          },
        },
      },
    });
    if (!user) return res.status(401).json({ error: "User or quizcode doesn't exists" });
    const token = generateToken({ userId: user.id });
    return res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: "Login Failed", message: (error as any).message });
    console.error(error);
  }
}

export async function adminLogin(req: Request, res: Response) {
  try {
    const { password = "" } = req.body;
    const hash = await hashPassword(process.env.ADMIN_PASSWORD || "ROOT");
    if (! await comparePasswords(password, hash)) return res.status(401).json({error:"Wrong password"});
    const token = generateToken({userId : "admin"});
    return res.json({token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Admin Login Failed", message: (error as any).message });
  }
}