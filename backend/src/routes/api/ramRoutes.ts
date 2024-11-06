// src/routes/ramRoutes.ts
import express from 'express';
import { getRamUsage } from '../../controllers/ramController';

const router = express.Router();

// Define the route to get RAM usage data
router.get('/ram-usage', getRamUsage);

export default router;
