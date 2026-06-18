import { defineConfig } from 'eslint/config'
import expoConfig from 'eslint-config-expo/flat.js'
import perfectionist from 'eslint-plugin-perfectionist'

export default defineConfig([
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'src/assets/'],
  },
  ...expoConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { perfectionist },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      // No HTML parser in RN — unescaped entities are safe
      'react/no-unescaped-entities': 'off',

      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          internalPattern: ['^@/'],
          newlinesBetween: 1,
        },
      ],
    },
  },
])
