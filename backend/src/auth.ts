import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

// Dummy user credentials
const users = [
  { id: 1, username: "user1", password: bcrypt.hashSync("password1", 10) },
  { id: 2, username: "user2", password: bcrypt.hashSync("password2", 10) },
];

// Secret key for JWT signing
const JWT_SECRET = "your_jwt_secret_key"; // In production, store in environment variables

// Login route
router.post("/login", function (req: Request, res: Response) {
  (async () => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create JWT payload
    const payload = { id: user.id, username: user.username };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  })();
});

export default router;
