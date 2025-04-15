// import type { Config } from 'jest';

// const config: Config = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   rootDir: '.', // Project root
//   testMatch: ['<rootDir>/test/**/*.(spec|test).(ts|tsx|js)'],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   moduleNameMapper: {
//     '^@/components/(.*)$': '<rootDir>/components/$1',
//     '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
//     '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
//     '^@/layouts/(.*)$': '<rootDir>/layouts/$1',
//     '^@/mocks/(.*)$': '<rootDir>/mocks/$1',
//     '^@/redux/(.*)$': '<rootDir>/redux/$1',
//     '^@/theme/(.*)$': '<rootDir>/theme/$1',
//     '^@/types/(.*)$': '<rootDir>/types/$1',
//     '^@/utils/(.*)$': '<rootDir>/utils/$1',
//     '^@/vendor/(.*)$': '<rootDir>/vendor/$1',
//     '^@/lib/(.*)$': '<rootDir>/lib/$1',
//     '^@/constants$': '<rootDir>/constants',
//     '^@/config$': '<rootDir>/config',
//     '^@/i18n$': '<rootDir>/i18n',
//     '^@/mocks$': '<rootDir>/mocks/index',
//     '^@/theme$': '<rootDir>/theme/index',
//   },
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest',
//   },
//   transformIgnorePatterns: ['<rootDir>/node_modules/'],
// };

// export default config;

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;