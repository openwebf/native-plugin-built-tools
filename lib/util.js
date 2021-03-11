const PATH = require('path');
const fs = require('fs');

function isFlutterPluginDir(path) {
  const pubspecFile = PATH.join(path, 'pubspec.yaml');
  return fs.existsSync(pubspecFile);
}

function isFlutterPubGet(path) {
  const packageConfigFile = PATH.join(path, '.dart_tool/package_config.json');
  return fs.existsSync(packageConfigFile);
}

function isProjectConfigured(path) {
  return fs.existsSync(PATH.join(path, 'bridge/kraken'));
}

function getProjectName(root) {
  const pubsepc = PATH.join(root, 'pubspec.yaml');
  const content = fs.readFileSync(pubsepc, {encoding: 'utf-8'});
  const contentGroup = content.split('\n');
  const name = contentGroup[0].substring(5).trim();
  return name;
}

exports.isFlutterPluginDir = isFlutterPluginDir;
exports.isFlutterPubGet = isFlutterPubGet;
exports.isProjectConfigured = isProjectConfigured;
exports.getProjectName = getProjectName;
