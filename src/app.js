import express from 'express';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// using Routes 
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

export default app;