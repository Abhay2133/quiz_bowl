import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import apiRoutes from "./routes/api"
dotenv.config();

const app = express();

app.use(morgan("dev"));
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

// Placeholder for routes
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz Bowl Backend API");
});

export default app;
