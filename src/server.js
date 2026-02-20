import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
// Middlewares
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
// Routers
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import storiesRoutes from './routes/storiesRoutes.js';
import storyRoutes from './routes/storyRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Auth routers
app.use(authRoutes);

// User routers
app.use(userRoutes);

// Stories routes
app.use(storiesRoutes);

// Story routers
app.use(storyRoutes);

// Middleware 404
app.use(notFoundHandler);

// Celebrate errors.
app.use(errors());

// Middleware Errors.
app.use(errorHandler);

// Connect Mongo
await connectMongoDB();

// Launch Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
