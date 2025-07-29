/** @type {import('jest').Config} */
export const preset = 'ts-jest';
export const testEnvironment = 'jsdom';
export const roots = ['<rootDir>/src'];
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.js'];
export const testPathIgnorePatterns = ['/node_modules/', '/.next/'];
export const moduleNameMapper = {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
};
export const transform = {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
};
