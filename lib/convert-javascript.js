const PATH = require('path');
const fg = require('fast-glob');
const uglify = require('uglify-js');
const fs = require('fs');
const { getProjectName } = require('../lib/util');
const { getPolyFillHeader, getPolyFillSource } = require('./js2c');

function searchJavaScriptFiles(root) {
  const files = fg.sync(['**/*.js'], {cwd: root, dot: false, followSymbolicLinks: false});
  return files;
}

function ensureTransformedDirExist(transformedDir) {
  if (!fs.existsSync(transformedDir)) {
    fs.mkdirSync(transformedDir);
  }
}

function getFileName(file) {
  let name = file.split('/').slice(-1)[0].split('.')[0];
  return name;
}

function createGitIgnoreFile(root) {
  let template = `.kraken-test-tools
build
kraken
cmake-build-*`;
  const ignoreFilePath = PATH.join(root, '.gitignore');
  if (!fs.existsSync(ignoreFilePath)) {
    fs.writeFileSync(ignoreFilePath, template);
  }
}

function jsToCpp(projectName, files, targetDir) {
  let header = getPolyFillHeader(projectName);
  let sourceInfo = files.map(file => {
    let content = fs.readFileSync(file, {encoding: 'utf-8'});
    let minifyCode = uglify.minify(content);
    let filename = getFileName(file);
    return {
      code: minifyCode.code,
      name: filename
    };
  });
  let source = getPolyFillSource(projectName, sourceInfo);
  fs.writeFileSync(PATH.join(targetDir, `${projectName}.h`), header);
  fs.writeFileSync(PATH.join(targetDir, `${projectName}.cc`), source);
}

function convertJavaScript(root) {
  const bridgeDirectory = PATH.join(root, 'bridge');
  const transformedDir = PATH.join(bridgeDirectory, '.kraken-test-tools');
  const projectName = getProjectName(root);
  ensureTransformedDirExist(transformedDir);
  createGitIgnoreFile(bridgeDirectory);
  let files = searchJavaScriptFiles(bridgeDirectory);

  if (files.length == 0) return;

  files = files.map(file => PATH.join(bridgeDirectory, file));
  jsToCpp(projectName, files, transformedDir);
}

module.exports = convertJavaScript;
