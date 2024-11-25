import { Prisma, PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

export default prisma;

export function errorResponse(error: any, res: Response) {
  // console.error(e);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      case "P2002": // Unique constraint violation
        return res.status(400).json({
          error: "A unique constraint violation occurred.",
          message: error.meta,
        });
      case "P2025": // Record not found
        return res.status(404).json({
          error: "The requested record does not exist.",
          message: error.meta,
        });
      // Add other cases as needed
      default:
        return res.status(500).json({
          error: "An unknown database error occurred.",
          message: error.message,
        });
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      error: "Failed to connect to the database.",
      message: error.message,
    });
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({
      error: "An internal error occurred in the database engine.",
      message: error.message,
    });
  } else {
    // Handle other unexpected errors
    return res.status(500).json({
      error: "An unexpected error occurred.",
      message: error.message,
    });
  }
}
