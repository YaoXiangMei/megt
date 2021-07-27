require('module-alias/register')
const fs = require('fs')
const { resolve } = require('path')
const shelljs = require('shelljs')
const template = require('art-template')
const { program } = require('commander')
const { getPkg } = require('@root/utils/helpers')

exports.getVersion = function () {
  return getPkg().version
}

exports.updateVersion = function (version) {
  fs.writeFileSync(resolve(process.cwd(), 'package.json'), JSON.stringify({...getPkg(), version}, null, 4))
}

exports.addGitCommit = function (version) {
  shelljs.exec('git add .', { silent: false })
  shelljs.exec(`git commit -m chore(release):${version} --no-verify`, { silent: false })
}

exports.updateGitLastCommit = function () {
  shelljs.exec('git add .', { silent: true })
  shelljs.exec('git commit --amend --no-edit --no-verify', { silent: true })
}

exports.addGitTag = function (tag) {
  shelljs.exec(`git tag -a v${tag} -m '${tag}'`, { silent: true })
}

exports.removeGitTag = function (tag) {
  shelljs.exec(`git tag -d ${tag}`, { silent: true })
}

exports.createVersionrc = function () {
  const pkg = getPkg()
  let commitTypes = {}
  // 不支持可选链接
  if (pkg.config && pkg.config.commitizen && pkg.config.commitizen.types) {
    commitTypes = pkg.config.commitizen.types
  }
  const types = Object
    .keys(commitTypes)
    .map(key => {
      if (['feat', 'fix'].includes(key)) {
        return {
          'type': key,
          'field': 'section',
          'value': `"${commitTypes[key]['title']}"`
        }
      } else {
        return {
          'type': key,
          'field': 'hidden',
          'value': true
        }
      }
    })
  console.log(types);
  const content = template(resolve(`${__dirname}`, '../template/versionrc.art'), { data: { 
      types,
      null: '{{NULL}}',
      host: '{{host}}',
      hash: '{{hash}}',
      id: '{{id}}'
  } })
  fs.writeFileSync(resolve(process.cwd(), program.opts().preset), content)
}