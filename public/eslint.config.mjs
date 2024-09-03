import globals, { jest } from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  jsdoc.configs["flat/recommended-error"],
  jest.configs.recommended.rules,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      jsdoc,
      pluginReact,
      jest,
    },
    rules: {
      "react/prop-types": "off",
      "jsdoc/check-syntax": "error",
      "jsdoc/check-indentation": "warn",
      "jsdoc/check-line-alignment": "warn",
      "jsdoc/imports-as-dependencies": "error",
      "jsdoc/informative-docs": "warn",
      "jsdoc/match-description": "warn",
      // "jsdoc/match-name": "error",
      "jsdoc/no-bad-blocks": "warn",
      "jsdoc/no-blank-block-descriptions": "warn",
      "jsdoc/no-blank-blocks": "error",
      // "jsdoc/no-missing-syntax": "warn",
      "jsdoc/require-description": "error",
      "jsdoc/require-example": "warn",

      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            // "MethodDefinition": false,
            // "ClassDeclaration": false,
            ArrowFunctionExpression: true,
            // "FunctionExpression": false
          },
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    languageOptions: {
      globals: [...globals.browser, ...globals.jest],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
];
