#!/usr/bin/env node

const path = require('path')
const handler = require('./runner')

const name = 'build'
const description = 'Builds all the CSS files'

const builder = (yargs) =>
  yargs
    .option('o', {
      alias: 'out',
      demandOption: false,
      describe: 'CSS files destination directory',
      type: 'string'
    })
    .help()

if (require.main === module) {
  require('yargs')
    .scriptName(name)
    .usage('$0 [out]', description, builder, handler).argv
}

module.exports = { command: name, desc: description, builder, handler }
