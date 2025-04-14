export default {
  verbose: true,
  collectCoverageFrom: [
    'src/**',
    '!src/server.ts',
    '!src/scripts/**',
  ],
  coverageDirectory: 'coverage/unit',
  coverageReporters: ['lcov', 'text'],
  setupFilesAfterEnv: ['jest-extended/all'],
  testMatch: ['**/tests/unit/**/?(*.)@(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        emitDecoratorMetadata: false,
      },
    ],
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10,
    },
  },
  moduleNameMapper: {
    '^@config': '<rootDir>/config/$1',
  },
};
