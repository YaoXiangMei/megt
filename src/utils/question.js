const inquirer = require('inquirer')
const fs = require('fs')
const { readFileSync, megtrcPath, updateMegtrc } = require('./helpers')

// 创建megtrc文件
exports.createPackageManager = function () {
  return new Promise((resolve, reject) => {
    const file = readFileSync(megtrcPath)
    let config = {}
    if (file) {
      try {
        config = JSON.parse(file)
      } catch (err) {
        fs.unlinkSync(megtrcPath)
      }
    }
    // 如果有包管理工具
    if (config.packageManager) {
      resolve()
      return
    }
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'packageManager',
          message: '请选择包管理工具',
          choices: [{
            name: 'npm',
            value: 'npm',
          }, {
            name: 'yarn',
            value: 'yarn',
          }],
        },
      ])
      .then(data => {
        config.packageManager = data.packageManager
        updateMegtrc(config)
        resolve()
      })
      .catch(reject)
  })
}
