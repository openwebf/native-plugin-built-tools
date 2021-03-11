const { isProjectConfigured, getProjectName } = require('../lib/util.js');
const buildMacOS = require('../lib/build-macos');
const buildIOS = require('../lib/build-ios');
const buildAndroid = require('../lib/build-android');
const path = require('path');
const cwd = process.cwd();
if (!isProjectConfigured(cwd)) {
  throw new Error('Project not configured. Please run kraken-npbt configure first!');
}

const projectName = getProjectName(cwd);
const bridgeDir = path.join(cwd, 'bridge');

buildMacOS(bridgeDir, projectName);
buildIOS(bridgeDir, projectName);
buildAndroid(bridgeDir, projectName);
