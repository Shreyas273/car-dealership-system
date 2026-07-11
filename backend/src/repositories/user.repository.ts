import { IUserDocument, User } from '../models/user.model';
import { UserRole } from '../types/auth.types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async create(data: CreateUserData): Promise<IUserDocument> {
    return User.create(data);
  }
}

export const userRepository = new UserRepository();
