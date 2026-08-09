// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import pluginVitest from '@vitest/eslint-plugin'
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ["dist/**", "benchmarks/dist/**"],
  },
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@stylistic": stylistic,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "linebreak-style": ["error", "unix"],
      "semi": ["error", "always"],
      "eqeqeq": ["error", "smart"],
      "no-template-curly-in-string": ["error"],
      "multiline-ternary": ["error", "always-multiline"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true, // Allows verbose && console.log().
        }
      ],
      "@stylistic/quote-props": [ "error", "consistent-as-needed" ],
      "@stylistic/indent": ["error", 2, {
        VariableDeclarator: "first",

        FunctionDeclaration: {
          parameters: "first",
        },

        FunctionExpression: {
          parameters: "first",
        },

        CallExpression: {
          arguments: "first",
        },

        ArrayExpression: "first",
        ObjectExpression: "first",
        ImportDeclaration: "first",
        MemberExpression: 1,
        SwitchCase: 1,
      }],
    },
  },
  {
    files: ["index.test.ts"],
    ...pluginVitest.configs.recommended,
  },
);
