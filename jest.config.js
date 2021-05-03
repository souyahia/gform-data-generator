module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/spec/**/*.spec.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov'],
};