"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./auth"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Use built-in morgan middleware
app.use((0, morgan_1.default)('combined'));
// Alternatively, use a custom logger
// app.use(logger);
app.use(express_1.default.json());
app.use('/api', auth_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
