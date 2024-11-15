/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  roots: ['./src/gimmeHTTP'],
  reporters: process.env.CI ? [['github-actions', {silent: false}], 'summary'] : ['default'],
  coverageThreshold: {
    global: {
      lines: 75,
    },
  },
}
