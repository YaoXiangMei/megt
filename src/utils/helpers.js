const fs = require('fs')
const { resolve } = require('path')
const shelljs = require('shelljs')
const chalk = require('chalk')

const packagePath = resolve(process.cwd(), './package.json')

// 用户home目录
const userHomeDir = process.env.HOME || process.env.USERPROFILE
// .megtrc文件目录
const megtrcPath = resolve(userHomeDir, '.megtrc')

/**
 * 读取磁盘文件
 * @param {string} path
*/
const readFileSync = function (path) {
  return fs.existsSync(path) ? fs.readFileSync(path, { encoding: 'utf8' }) : false
}

/**
 * 获取package.json
*/
const getPkg = function () {
  return JSON.parse(readFileSync(packagePath))
}

/**
 * 更新package.json
 * @param {object} package
*/
const updatePkg = function (pkg) {
  fs.writeFileSync(
    packagePath,
    JSON.stringify(pkg, null, 2),
    { encoding: 'utf8' },
  )
}

/**
 * 更新.megtrc文件
 * @param {object} package
*/
const updateMegtrc = function (megtrc) {
  fs.writeFileSync(
    megtrcPath,
    JSON.stringify(megtrc, null, 2),
    { encoding: 'utf8' },
  )
}

/**
 * 获取包管理工具
 */
const getPackageManager = function () {
  let packageManager = 'npm'
  try {
    packageManager = JSON.parse(readFileSync(megtrcPath)).packageManager
  } catch {}
  return packageManager
}

/**
 * 安装依赖
 * @param {object} [deps={}] - 需要安装的依赖
 * @param {object} [options={}] - 配置
 * @param {string} [options.saveType=-D] [-P|--save-prod|-D|--save-dev|-O|--save-optional|--save-peer] [-E|--save-exact] [-B|--save-bundle] [--no-save] [--dry-run]
 * @param {boolean} [options.isAsync=true] - 是否异步安装依赖
*/
const installDeps = function (deps = {}, { saveType = '-D', isAsync = true } = {}) {
  const res = Object.keys(deps).map((name) => {
    return `${getPackageManager()} add ${name}@${deps[name]} ${saveType}`
  })

  const exec = (command) => {
    return new Promise((resolve, reject) => {
      shelljs.exec(command, (code) => {
        code === 0 ? resolve() : reject(new Error())
      })
    })
  }
  const hook = {
    // 并行
    parallel () {
      return res.map(exec)
    },
    // 串行
    async series () {
      for (let command of res) {
          await exec(command)
      }
    }
  }

  return Promise.all(isAsync ? hook.parallel() : [hook.series()])
    .then(() => {
      shelljs.echo('安装依赖成功')
    })
    .catch(() => {
      shelljs.echo('安装依赖失败')
    })
}

// 控制台打印
const chalkLog = function (msg, style = 'cyanBright') {
  console.log(chalk[style](msg))
}

module.exports = {
  readFileSync,
  getPkg,
  updatePkg,
  installDeps,
  chalkLog,
  megtrcPath,
  updateMegtrc,
  getPackageManager,
}
