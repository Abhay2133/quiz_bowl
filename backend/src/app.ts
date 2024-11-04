import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Application = express();

app.use(morgan("dev"));
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);

// Placeholder for routes
app.get("/", (req, res) => {
  res.send("Quiz Bowl Backend API");
});

export default app;
