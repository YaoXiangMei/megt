#!/usr/bin/env node

require('module-alias/register')
const shelljs = require('shelljs')
const merge = require('lodash/fp/merge')
const { getPkg, updatePkg, installDeps } = require('@root/utils/helpers')
const { createPackageManager } = require('@root/utils/question')
const {
  devDependencies,
} = require('./config/dependents')
const types = {
  feat: {
    title: 'feat',
    description: '新功能',
  },
  fix: {
    title: 'fix',
    description: '修复bug',
  },
  style: {
    title: 'style',
    description: '代码格式(不影响代码运行的格式变动，注意不是指 CSS 的修改)',
  },
  refactor: {
    title: 'refactor',
    description: '重构(既不是新增功能，也不是修改 bug 的代码变动)',
  },
  perf: {
    title: 'perf',
    description: '提升性能',
  },
  revert: {
    title: 'revert',
    description: '恢复上一次提交',
  },
  ci: {
    title: 'ci',
    description: '持续集成相关文件修改',
  },
  release: {
    title: 'release',
    description: '发布新版本',
  },
  chore: {
    title: 'chore',
    description: '构建或辅助工具的变动',
  },
  docs: {
    title: 'docs',
    description: '文档',
  },
  test: {
    title: 'test',
    description: '提交测试代码(单元测试，集成测试等)',
  },
  build: {
    title: 'release',
    description: '影响项目构建或依赖项修改',
  },
  init: {
    title: 'init',
    description: '初始提交',
  },
}
;(async () => {
  await createPackageManager()
  installDeps(devDependencies)
    .then(() => {
      return new Promise((resolve) => {
        shelljs.exec('npx commitizen init cz-conventional-changelog -D --force', (code) => {
          code === 0 && resolve()
        })
      })
    })
    .then(() => {
      let pkg = getPkg()
      pkg = merge(
        pkg,
        {
          config: {
            commitizen: {
              types,
            },
          },
        },
      )
      updatePkg(pkg)
    })
})()
