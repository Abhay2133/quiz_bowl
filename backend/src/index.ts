import express from 'express';
import morgan from 'morgan';
import authRoutes from './auth';

const app = express();
const PORT = process.env.PORT || 3000;

// Use built-in morgan middleware
app.use(morgan('combined'));

// Alternatively, use a custom logger
// app.use(logger);

app.use(express.json());
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
