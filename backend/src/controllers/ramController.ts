// src/controllers/ramController.ts
import { Request, Response } from 'express';
import os from 'os';

// Helper function to format bytes to a human-readable format
function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

// Controller to get RAM usage data
export const getRamUsage = (req: Request, res: Response): void => {
  const totalMemory = os.totalmem(); // Total system memory in bytes
  const freeMemory = os.freemem();   // Free system memory in bytes
  const usedMemory = totalMemory - freeMemory; // Used system memory
  const memoryUsagePercentage = (usedMemory / totalMemory) * 100; // Percentage of memory used

  const data = {
    totalMemory: formatBytes(totalMemory),
    freeMemory: formatBytes(freeMemory),
    usedMemory: formatBytes(usedMemory),
    memoryUsagePercentage: memoryUsagePercentage.toFixed(2) + '%',
  }

  console.table(data);
  res.json(data);
};
