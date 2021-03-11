const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const { isFlutterPluginDir } = require('../lib/util');

if (!isFlutterPluginDir(cwd)) {
  throw new Error('Can not location flutter plugin directory.');
}

fs.rmdirSync(path.join(cwd, 'bridge/kraken'), { recursive: true });
fs.rmdirSync(path.join(cwd, 'bridge/.kraken-test-tools'), { recursive: true });

