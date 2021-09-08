module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'standard',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    /**
      @description 尾随逗号
    */
    'comma-dangle': [2, 'always-multiline'],
    /**
      @description 缩进风格
    */
    indent: [2, 2, {
      SwitchCase: 1,
    }],
    /**
      @description 不要求使用 === 和 !==
    */
    eqeqeq: 0,
  },
}
