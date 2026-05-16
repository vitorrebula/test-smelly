import jest from 'eslint-plugin-jest';

export default [
  {
    files: ['**/*.test.js'],
    plugins: { jest },
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-identical-title': 'error',
      'jest/expect-expect': 'warn',
    },
  },
];