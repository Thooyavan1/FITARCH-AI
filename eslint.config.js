import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";
import { globalIgnores } from "eslint/config";

export default [
  globalIgnores(["dist", "build"]),
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: true,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint.plugin,
      tailwindcss,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "plugin:tailwindcss/recommended",
      prettier,
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",
      "prettier/prettier": "warn",
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
  },
];
