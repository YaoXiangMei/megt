const conventionalChangelog = require('conventional-changelog')
const fs = require('fs')
const path = require('path')
const { program } = require('commander')
const presetLoader = require('./loader/preset')
const START_OF_LAST_RELEASE_PATTERN = /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m

exports.createChangelog = function () {
  return new Promise((resolve, reject) => {

    const changelogPath = path.resolve(process.cwd(), program.opts().output)
    let oldContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf-8') : ''
    const oldContentStart = oldContent.search(START_OF_LAST_RELEASE_PATTERN)

    if (oldContentStart !== -1) {
      oldContent = oldContent.substring(oldContentStart)
    }

    const preset = presetLoader()
    const changelogStream = conventionalChangelog({
      preset: preset
    })

    changelogStream.on('error', function (err) {
      console.error(err.stack)
      process.exit(1)
      return reject(err)
    })
    
    let content = ''

    changelogStream.on('data', function (buffer) {
      content += buffer.toString()
    })

    changelogStream.on('end', function () {
      fs.writeFileSync(program.opts().output, `${preset.header}\n${content}${oldContent}`, 'utf-8')
      return resolve()
    })
  })
}