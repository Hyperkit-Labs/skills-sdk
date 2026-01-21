module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Root directory
  rootDir: '.',

  // Test match patterns
  testMatch: ['<rootDir>/packages/*/tests/**/*.test.ts', '<rootDir>/packages/*/src/**/*.test.ts'],

  // Module paths
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@skills-sdk/parsers$': '<rootDir>/packages/parsers/src',
    '^@skills-sdk/validators$': '<rootDir>/packages/validators/src',
    '^@skills-sdk/bundler$': '<rootDir>/packages/bundler/src',
    '^@skills-sdk/cli$': '<rootDir>/packages/cli/src',
  },

  // Coverage
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/*/src/**/*.test.ts',
    '!packages/*/src/**/*.spec.ts',
    '!packages/*/src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Transform
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Verbose output
  verbose: true,
};
