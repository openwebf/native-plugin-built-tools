const PATH = require('path');
const fs = require('fs');

function findKraken() {
  const cwd = process.cwd();

  const packageConfigFile = PATH.join(cwd, '.dart_tool/package_config.json');
  const packageConfig = require(packageConfigFile);
  const kraken = packageConfig.packages.find(item => item.name === 'kraken');
  let krakenPath = kraken.rootUri;

  if (krakenPath.indexOf('file://') >= 0) {
    krakenPath = krakenPath.substring(7);
  }

  if (!PATH.isAbsolute(krakenPath)) {
    krakenPath = krakenPath.substring(3);
    krakenPath = PATH.join(cwd, krakenPath);
  }

  return krakenPath;
}

module.exports = findKraken;
