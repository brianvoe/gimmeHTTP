export default {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
  },
  extends: "standard-with-typescript",
  overrides: [
    {
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    // ecmaVersion: "latest"
  }
}
