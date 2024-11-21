import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

const SECRET_KEY = "your-secret-key"; // Replace with your actual secret key

/**
 * Admin protection middleware
 */
export const adminProtectionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // Check if JWT token exists in cookies
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    // Verify the token
    const payload = verifyToken(token) as { userId: string };

    // Check if userId is "admin"
    if (payload.userId !== (process.env.ADMIN_ID || "admin")) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
