module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  overrides: [
    // No console
    {
      files: ["*.ts"],
      rules: {
        "no-console": "error",
        "@typescript-eslint/no-misused-promises": "off"
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  rules: {},
}
