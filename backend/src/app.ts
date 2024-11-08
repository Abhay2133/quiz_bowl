import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import apiRoutes from "./routes/api"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"

import cors from "cors"
dotenv.config();

const app = express();

app.use(morgan("common"));
app.use(cors())
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes)

// Placeholder for routes
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz Bowl Backend API");
});

export default app;
