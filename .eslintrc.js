module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    // 'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off'
  }
}
