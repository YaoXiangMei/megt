#!/usr/bin/env node

require('module-alias/register')
const shelljs = require('shelljs')
const merge = require('lodash/fp/merge')
const { getPkg, updatePkg, installDeps } = require('@root/utils/helpers')
const { createPackageManager } = require('@root/utils/question')
const {
  devDependencies,
} = require('./config/dependents')
const { resolve } = require('path')

const createCommitlintConfig = function () {
  // shelljs.exec('echo module.exports = { extends: [\'@commitlint/config-conventional\'] } > commitlint.config.js')
  shelljs.cp('-R', resolve(__dirname, 'template/commitlint.config.js'), resolve(process.cwd()))
}
;(async () => {
  await createPackageManager()
  installDeps(devDependencies)
    .then(() => {
      let pkg = getPkg()
      pkg = merge(
        pkg,
        {
          husky: {
            hooks: {
              'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
            },
          },
        },
      )
      updatePkg(pkg)
    })
    .then(() => {
      createCommitlintConfig()
    })
})()
