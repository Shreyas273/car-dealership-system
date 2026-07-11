import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/user.model';

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await disconnectDatabase();
});
