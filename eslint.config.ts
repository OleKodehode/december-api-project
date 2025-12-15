import js from "@eslint/js";
import tselint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig(
  // Seperate config for eslint.config.ts file itself to avoid self-type-checking error

  {
    files: ["eslint.config.ts"],
    extends: [js.configs.recommended],
  },

  // Main config
  {
    files: ["src/**/*.ts"],

    languageOptions: {
      parserOptions: {
        project: true, // Supposedly uses tsconfig.json automatically
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.node,
    },

    extends: [
      js.configs.recommended, // ESLint core
      ...tselint.configs.recommended, // @typescript-eslint recommended
      prettierRecommended, // disabling of conflicting style rules
    ],

    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: ["dist/", "node_modules/", "**/*.js"],
  }
);
