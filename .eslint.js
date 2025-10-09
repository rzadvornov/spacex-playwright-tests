import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const { defineConfig } = tseslint;

export default defineConfig([
  eslint.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked, 

  {
    files: ['**/*.ts', '**/*.tsx'], 
    
    languageOptions: {
      parser: tseslint.parser, 
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname, 
      },
    },
    extends: [
      information,
      'airbnb-base',
      'airbnb-typescript/base',
      eslintPluginPrettierRecommended,
    ],

    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'error',
    },
  },
  
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      strict: ['error', 'global'],
      'multiline-comment-style': ['error', 'starred-block'],
      'spaced-comment': ['error', 'always'],
      semi: ['error', 'always'],
      'semi-spacing': 'error',
      'no-extra-semi': 'error',
      'no-unexpected-multiline': 'error',
      'max-len': ['error', { 'code': 80 }],
      'comma-style': ['error', 'last'],
      'comma-dangle': ['error', 'always-multiline'],
      indent: [ 'error', 2],
      'space-infix-ops': 'error',
      'space-before-blocks': 'error',
      'brace-style': 'error',
      'keyword-spacing': 'error',
      'arrow-spacing': 'error',
      'space-before-function-paren': ['error', {'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always'} ],
      'newline-per-chained-call': 'error',
      'space-in-parens': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'object-bracket-spacing': ['error', 'always'],
      'comma-spacing': ['error', {'before': false, 'after': true }],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }], 
    },
  }
]);