#!/usr/bin/env node

require('module-alias/register')
const shelljs = require('shelljs')
const merge = require('lodash/fp/merge')
const helpersCommander = require('./helpers/commander')
const { program } = require('commander')
const { chalkLog } = require('@root/utils/helpers')
const {
  devDependencies,
} = require('./config/dependents.js')
const {
  selectVersion,
  confirmVersion,
  confirmChangeLog,
  lastConfirm
} = require('./helpers/question')
const {
  updateVersion,
  createVersionrc,
  addGitCommit,
  addGitTag,
  updateGitLastCommit
} = require('./helpers/index')
const { createChangelog } = require('./helpers/create-changelog/index')

helpersCommander()
createVersionrc()
  ;(async () => {
    try {
      const { version } = await selectVersion()
      const { confirmVersion: isConfirmVersion } = await confirmVersion(version)
      if (!isConfirmVersion) return
      const { confirmChangeLog: isCreateChangelog } = await confirmChangeLog()
      const { lastConfirm: isLastConfirm } = await lastConfirm(version, isCreateChangelog)

      if (!isLastConfirm) return

      chalkLog('运行中，请稍候...')
      updateVersion(version)

      const { tag, commit } = program.opts()

      if (commit) {
        addGitCommit(version)
      }

      if (isCreateChangelog) {
        await createChangelog()
        commit && updateGitLastCommit()
      }
      if (commit && tag) {
        addGitTag(version)
      }
    } catch (err) {
      chalkLog(err)
    }
  })()
