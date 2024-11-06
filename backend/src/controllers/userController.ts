// src/controllers/userController.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { name, email, teamId } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, teamId },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, teamId } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, teamId },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user' });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};
