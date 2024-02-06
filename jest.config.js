/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '.(ts|tsx)': require.resolve('ts-jest'),
  },
  roots: ['<rootDir>/src'],
};
