export default {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-multi-spaces": "error",
    "no-trailing-spaces": "error",
    "space-before-function-paren": ["error", "never"],
    "function-call-argument-newline": ["error", "consistent"],
    "function-paren-newline": ["error", "multiline"],
  },
};
