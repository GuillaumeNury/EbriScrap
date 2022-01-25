module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['examples', 'dist'],
  collectCoverage: true,
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
};