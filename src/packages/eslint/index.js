#!/usr/bin/env node

require('module-alias/register')
// const shelljs = require('shelljs')
const fs = require('fs')
const { resolve } = require('path')
const merge = require('lodash/fp/merge')
const template = require('art-template')
const { getPkg, updatePkg, installDeps } = require('@root/utils/helpers')
const { createPackageManager } = require('@root/utils/question')
const {
  devDependencies,
} = require('./config/dependents')
;(async () => {
  await createPackageManager()
  // 串行安装 否则大概率安装失败
  installDeps(devDependencies, { isAsync: false })
    .then(() => {
      let pkg = getPkg()
      pkg = merge(
        pkg,
        {
          husky: {
            hooks: {
              'pre-commit': 'lint-staged',
            },
          },
          'lint-staged': {
            '*.{js,ts}': [
              'npx eslint --fix',
            ],
          },
        },
      )
      updatePkg(pkg)
    })
    .then(() => {
      // eslint-disable-next-line node/no-path-concat
      const content = template(resolve(`${__dirname}/template/eslintrc.art`), { data: { isTs: false } })
      fs.writeFileSync(resolve(process.cwd(), '.eslintrc.js'), content)
    })
})()
