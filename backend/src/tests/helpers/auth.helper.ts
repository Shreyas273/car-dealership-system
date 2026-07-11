import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../../models/user.model';
import { UserRole } from '../../types/auth.types';

interface TestUserOptions {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const createTestUser = async (
  options: TestUserOptions = {},
): Promise<{ token: string; id: string; email: string; role: UserRole }> => {
  const name = options.name ?? 'Test User';
  const email = options.email ?? `user-${Date.now()}@example.com`;
  const password = options.password ?? 'password123';
  const role = options.role ?? 'user';

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: '1h' },
  );

  return {
    token,
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
};

export const authHeader = (token: string): { Authorization: string } => ({
  Authorization: `Bearer ${token}`,
});
