#!/usr/bin/env node

const shelljs = require('shelljs')
const { resolve } = require('path')

shelljs.cp('-R', resolve(__dirname, 'template/.editorconfig'), resolve(process.cwd()))
