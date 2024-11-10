import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

const prisma = new PrismaClient();

export default prisma;

export function errorResponse(e:any, res:Response){
  // console.error(e);
  const {message, code, meta} = e;
  res.status(500).json({message, code, meta});
}