import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';

const app: Application = express();

const allowedOrigins = env.frontendUrl
  ? env.frontendUrl.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Car Dealership API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use(errorMiddleware);

export default app;
