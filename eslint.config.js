import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['backend/**/*.ts'],
    ignores: ['node_modules/**', 'dist/**', '*.d.ts', 'frontend/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        Buffer: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'no-console': 'warn',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'max-len': [
        'error',
        { code: 120, ignoreComments: true, ignoreUrls: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'error',
    },
  },
];
