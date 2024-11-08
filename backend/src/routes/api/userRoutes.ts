// src/routes/userRoutes.ts
import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser, getUsersByTeamId } from '../../controllers/userController';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.get('/users/team/:teamId', getUsersByTeamId);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
