export default {
  env: {
    browser: false,
    commonjs: true,
    es2021: true
  },
  extends: ['standard-with-typescript', 'plugin:vue/vue3-recommended'],
  overrides: [
    {
      env: {
        node: true
      },
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
    // ecmaVersion: "latest"
  },
  rules: {
    // ESLint
    camelcase: 'off',
    'no-useless-escape': 'off',
    'no-empty-pattern': 'off',
    'no-new': 'off',
    'space-before-function-paren': 'off',
    indent: 'off',
    'object-shorthand': 'off',

    // Vue
    'vue/multi-word-component-names': 'off',
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'style', 'template']
      }
    ],
    'vue/order-in-components': [
      'error',
      {
        order: [
          'name',
          'components',
          'props',
          'data',
          'setup',
          'mounted',
          'beforeUnmount',
          'unmounted',
          'computed',
          'watch',
          'methods'
        ]
      }
    ]
  }
}
