import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { errorMiddleware } from './middleware/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Car Dealership API is running',
  });
});

app.use(errorMiddleware);

export default app;
