import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  verbose: true,
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  maxWorkers: '',
  rootDir: './',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
};

export default config;
