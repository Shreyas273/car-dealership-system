import dotenv from 'dotenv';

dotenv.config();

const baseUri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/car-dealership';

process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST ??
  baseUri.replace(/\/([^/?]+)(\?|$)/, '/car-dealership-test$2');

process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret';
process.env.NODE_ENV = 'test';
