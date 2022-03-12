module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test', '<rootDir>/edge-functions'],
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
