import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, import: importPlugin },
    extends: ["js/recommended"],
    languageOptions: { 
      globals: { ...globals.browser, ...globals.node } 
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"]
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ],
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: [],
    ...prettierConfig,
  },
  {
    ignores: [
      "node_modules",
      "dist",
      ".venv",
      "tmp"
    ],
  },
]);
