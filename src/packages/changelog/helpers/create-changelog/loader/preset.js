// TODO: this should be replaced with an object we maintain and
// describe in: https://github.com/conventional-changelog/conventional-changelog-config-spec
const spec = require('conventional-changelog-config-spec')
const resolve = require('path').resolve
const { program } = require('commander')

module.exports = () => {
  const defaultPreset = require.resolve('conventional-changelog-conventionalcommits')
  const config = require(resolve(process.cwd(), program.opts().preset))
  const preset = {
    name: defaultPreset,
  }
  Object.keys(spec.properties).forEach(key => {
    if (config[key] !== undefined) preset[key] = config[key]
  })
  return preset
}
