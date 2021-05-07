const PATH = require('path');
const fs = require('fs');
const configureProject = require('../lib/configure-project');
const { isFlutterPluginDir, isFlutterPubGet, isProjectConfigured } = require('../lib/util.js');
const generateCMake = require('../lib/generate-cmake');
const convertJavaScript = require('../lib/convert-javascript');
const { findKraken, findJSC } = require('../lib/finder');

const krakenPath = findKraken();
const jscPath = findJSC();
const cwd = process.cwd();

if (!isFlutterPluginDir(cwd)) {
  throw new Error('Can not location flutter plugin directory.');
}

if (!isFlutterPubGet(cwd)) {
  throw new Error('Please run `flutter pub get` first.');
}

if (!isProjectConfigured(cwd)) {
  configureProject(cwd, krakenPath, jscPath);
}

convertJavaScript(cwd);
generateCMake(cwd);

console.log('Configure success');
