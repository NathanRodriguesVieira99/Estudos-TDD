module.exports = {
  extends: [],
  parser: "@typescript-eslint/parser",
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
