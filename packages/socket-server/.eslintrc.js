module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // 禁止使用 var
    'newline-per-chained-call': 'off',
    'no-var': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'prefer-const': 'error',
    'no-console': 'error',
    '@typescript-eslint/newline-per-chained-call': 'off',
  },
};
