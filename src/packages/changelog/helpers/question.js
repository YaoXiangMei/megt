
const inquirer = require('inquirer')
const semver = require('semver')
const chalk = require('chalk')
const { VERSION_PREFIX } = require('../config/index')
const { getVersion } = require('./index')

exports.selectVersion = function () {
  const choices = VERSION_PREFIX.map(prefix => {
    if (!Array.isArray(prefix)) {
      prefix = [prefix]
    }
    const version = semver.inc(getVersion(), ...prefix)
      return {
        name: `${prefix.join('-')} ${version}`,
        value: version
      }
    })
    return new Promise((resolve, reject) => {
      inquirer
      .prompt([
        {
          type: 'list',
          name: 'version',
          message: '请选择版本',
          choices: choices
        }
      ])
      .then(resolve)
      .catch(reject)
    })
}


exports.confirmVersion = function (newVwesion) {
  return new Promise((resolve, reject) => {
    inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirmVersion',
        message: `确定要从${getVersion()}版本升级到${newVwesion}版本吗？`
      }
    ])
    .then(resolve)
    .catch(reject)
  })
}


exports.confirmChangeLog = function () {
  return new Promise((resolve, reject) => {
    inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirmChangeLog',
        message: () => {
          return `是否需要生成CHANGELOG.md？${chalk.yellow('（tip:截止到上个tag时commit type中不存在fix或feat时不需要生成CHANGELOG.md）')}`
        },
        default: false
      }
    ])
    .then(resolve)
    .catch(reject)
  })
}

exports.lastConfirm = function (newVersion, isCreateChangelog) {
  return new Promise((resolve, reject) => {
    inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'lastConfirm',
        message: () => {
          const msg = `确定要从${getVersion()}版本升级到${newVersion}版本，并${isCreateChangelog ? '' : '不'}生成CHANGELOG.md吗`
          return chalk.yellow(msg)
        },
        default: false
      }
    ])
    .then(resolve)
    .catch(reject)
  })
}