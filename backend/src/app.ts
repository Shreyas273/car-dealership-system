import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';

const app: Application = express();

const corsOptions = env.frontendUrl
  ? { origin: env.frontendUrl, credentials: true }
  : undefined;

app.use(cors(corsOptions));
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
