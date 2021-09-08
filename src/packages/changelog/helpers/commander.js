const { program } = require('commander')
const { getVersion } = require('./index')
module.exports = function () {
  program
    .version(getVersion(), '-V --version', '当前版本')
    .option('-p, --preset <value>', '预设配置文件,默认为.versionrc.js', '.versionrc.js')
    .option('-o, --output <value>', '输出changelog的文件名', 'CHANGELOG.md')
    .option('-t, --tag', '是否需要自动打tag', false)
    .option('-c, --commit', '是否需要自动提交代码到本地仓库', true)
  program.parse()
}
