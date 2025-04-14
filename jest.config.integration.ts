export default {
  verbose: true,
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**'],
  coverageDirectory: 'coverage/integration',
  coverageReporters: ['lcov', 'text'],
  setupFilesAfterEnv: ['jest-extended/all'],
  testMatch: ['**/tests/integration/**/?(*.)@(spec|test).[tj]s?(x)'],
  testTimeout: 30000,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@config': '<rootDir>/config/$1',
  },
};
