module.exports = {
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/*spec.ts', '**/src/**/*.it.(ts|js)', '**/src/**/it.(ts|js)'],
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/server.ts',
    '!src/config/config.ts',
    '!src/helpers/logger.ts',
    '!src/helpers/APIError.ts',
    '!src/http-server/*',
    '!src/forward-error/*',
    '!src/errors/*',
    '!src/logger/*',
    '!src/middleware/*',
    '!src/providers/*',
    '!src/routes/*',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['lcov', 'text'],
  // For more info see https://jestjs.io/docs/configuration#coveragethreshold-object
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testResultsProcessor: 'jest-sonar-reporter',
};
