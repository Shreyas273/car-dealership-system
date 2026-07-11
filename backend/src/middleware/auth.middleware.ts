import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error.middleware';
import { userRepository } from '../repositories/user.repository';
import { UserRole } from '../types/auth.types';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError(401, 'Invalid token');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, 'Invalid or expired token');
  }
};

export const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  if (req.user.role !== 'admin') {
    throw new AppError(403, 'Admin access required');
  }

  next();
};
