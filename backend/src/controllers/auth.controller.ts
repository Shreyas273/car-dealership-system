import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const result = await authService.register(name, email, password);

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.getProfile(req.user!.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
};
