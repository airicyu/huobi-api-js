'use strict'
/* eslint-env node */

module.exports = {
    transform: {
        '.(ts|tsx)': 'ts-jest',
    },
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    coveragePathIgnorePatterns: ['/node_modules/', '/test/', '/src/defaultHttpClient.ts', '/src/defaultLogger.ts'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
    collectCoverageFrom: ['src/*.{js,ts}'],
}
