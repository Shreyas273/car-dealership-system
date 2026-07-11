import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicle.model';

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await User.deleteMany({});
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await disconnectDatabase();
});
