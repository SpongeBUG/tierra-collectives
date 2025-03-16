/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  plugins: [
    "@typescript-eslint",
    "jsx-a11y",
    "import"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": ["warn", { 
      allowExpressions: true,
      allowTypedFunctionExpressions: true 
    }],
    "@typescript-eslint/no-unused-vars": ["error", { 
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_" 
    }],
    "jsx-a11y/anchor-is-valid": "warn",
    "import/order": ["warn", {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true }
    }],
    "prefer-const": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  globals: {
    shopify: "readonly"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  ignorePatterns: [
    "node_modules/",
    "build/",
    "public/build/",
    ".cache/",
    "dist/",
    "coverage/",
    "prisma/generated/"
  ]
};