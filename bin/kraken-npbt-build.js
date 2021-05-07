const { isProjectConfigured, getProjectName } = require('../lib/util.js');
const buildMacOS = require('../lib/build-macos');
const buildIOS = require('../lib/build-ios');
const buildAndroid = require('../lib/build-android');
const { findJSC, findKraken } = require('../lib/finder');
const { program } = require('commander');
const path = require('path');
const cwd = process.cwd();
if (!isProjectConfigured(cwd)) {
  throw new Error('Project not configured. Please run kraken-npbt configure first!');
}

program
  .option('--debug', 'Build a debug version of your libs.')
  .option('--no-ios', 'Whether to build libs for iOS platform.')
  .option('--no-android', 'Whether to build libs for android platform.')
  .option('--no-macos', 'Whether to build libs for macOS platform.')

program.parse(process.argv);

const options = program.opts();

const projectName = getProjectName(cwd);
const bridgeDir = path.join(cwd, 'bridge');
const jscPath = findJSC();
const krakenPath = findKraken();

options.macos && buildMacOS(bridgeDir, projectName, jscPath);
options.android && buildAndroid(bridgeDir, projectName, krakenPath);
options.ios && buildIOS(bridgeDir, projectName, jscPath);
