/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],
  setupFiles: ['<rootDir>/src/tests/jest.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.afterEnv.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  maxWorkers: 1,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/tests/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
