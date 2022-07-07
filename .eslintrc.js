'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint'],
  extends: ['prettier'],
  overrides: [
    {
      files: ['**/*.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['src/**/*.ts'],
      rules: {
        '@typescript-eslint/no-require-imports': 'error',
      },
    },
  ],
};
