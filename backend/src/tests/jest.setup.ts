import dotenv from 'dotenv';

dotenv.config();

// Always use an isolated test database and JWT secret (never production Atlas/.env values).
process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST ??
  'mongodb://localhost:27017/car-dealership-test';

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';
