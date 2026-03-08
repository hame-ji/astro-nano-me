import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import globals from "globals";

const sharedRules = {
  semi: ["error", "always"],
  quotes: ["error", "double", { allowTemplateLiterals: true }],
  "@typescript-eslint/triple-slash-reference": "off",
};

export default [
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", ".vscode/**"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...tsPlugin.configs["flat/recommended"],
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      parser: tsParser,
    },
    rules: sharedRules,
  },
  {
    files: ["**/*.astro", "**/*.astro/*.ts", "*.astro", "*.astro/*.ts"],
    rules: sharedRules,
  },
];
