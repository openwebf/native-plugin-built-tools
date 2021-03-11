#!/usr/bin/env node

const { program } = require('commander');
const packageJSON = require('../package.json');

program
  .version(packageJSON.version)
  .description('kraken native(C/C++) plugin build tool.')
  .command('configure', 'Generates a CMake project for the current plugin.')
  .command('clean', 'Removes any generated build files and generated dynamic libs.')
  .command('build', 'builds the modules.')
program.parse(process.argv);
