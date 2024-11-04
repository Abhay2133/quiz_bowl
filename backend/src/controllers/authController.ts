import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { generateToken, verifyToken } from '../utils/jwt';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, teamName, testCode } = req.body;

  const user = await prisma.user.findFirst({
    where: { username, teamName, testCode },
  });
  
  if (!user) {
    res.status(404).json({ message: 'Invalid login credentials' });
    return;
  }

  const token = generateToken(user.id);
  res.status(200).json({ token });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, teamName, testCode } = req.body;

  // Check if the user already exists
  const existingUser = await prisma.user.findFirst({
    where: { username, teamName },
  });

  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      username,
      teamName,
      testCode,
    },
  });

  // Generate JWT token for the newly created user
  const token = generateToken(newUser.id);
  console.log(verifyToken(token))
  res.status(201).json({ token });
};
