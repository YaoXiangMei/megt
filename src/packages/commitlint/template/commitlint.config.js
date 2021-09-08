module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'style',
        'refactor',
        'perf',
        'revert',
        'ci',
        'release',
        'chore',
        'docs',
        'test',
        'build',
        'init',
      ],
    ],
  },
}
