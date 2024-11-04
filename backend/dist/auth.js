"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
// Dummy user credentials
const users = [
    { id: 1, username: "user1", password: bcrypt_1.default.hashSync("password1", 10) },
    { id: 2, username: "user2", password: bcrypt_1.default.hashSync("password2", 10) },
];
// Secret key for JWT signing
const JWT_SECRET = "your_jwt_secret_key"; // In production, store in environment variables
// Login route
router.post("/login", function (req, res) {
    (() => __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        // Find user by username
        const user = users.find((u) => u.username === username);
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        // Verify password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        // Create JWT payload
        const payload = { id: user.id, username: user.username };
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    }))();
});
exports.default = router;
