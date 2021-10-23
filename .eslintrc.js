module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    "standard"
  ],
  parserOptions: {
    ecmaVersion: 13
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"]
  }
};
