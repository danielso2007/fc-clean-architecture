import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "path";
import { fileURLToPath } from "url";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2025,
        sourceType: "module",
        project: path.resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname
      },
      globals: globals.browser
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "indent": ["error", 2],
      "quotes": ["error", "single", { avoidEscape: true }],
      "semi": ["error", "always"],
      "no-duplicate-imports": "error",
      "import/no-unresolved": "off",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "indent": ["error", 4],
      ...prettierConfig.rules,
    },
  }
]);