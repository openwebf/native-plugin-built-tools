const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;

function configureProject(root, krakenPath) {
  const targetDir = path.join(root, 'bridge/kraken');
  const targetLibDir = path.join(targetDir, 'lib');
  const targetMacOSLibDir = path.join(targetLibDir, 'macos');
  const targetIosLibDir = path.join(targetLibDir, 'ios');
  const targetAndroidLibDir = path.join(targetLibDir, 'android');

  const krakenInclude = path.join(krakenPath, 'include');
  const krakenMacOSLib = path.join(krakenPath, 'macos/libkraken_jsc.dylib');
  const krakenIosLib = path.join(krakenPath, 'ios/kraken_bridge.framework');
  const krakenAndroidLib = path.join(krakenPath, 'android/jniLibs');

  const thirdPartyDir = path.join(__dirname, '../third_party');

  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(targetLibDir, { recursive: true });
  fs.mkdirSync(targetMacOSLibDir, { recursive: true });
  fs.mkdirSync(targetIosLibDir, { recursive: true });
  fs.mkdirSync(targetAndroidLibDir, { recursive: true });

  exec(`ln -s ${krakenInclude}`, {
    stdio: 'inherit',
    cwd: targetDir
  });
  exec(`ln -s ${krakenMacOSLib}`, { cwd: targetMacOSLibDir, stdio: 'inherit' });
  exec(`ln -s ${krakenIosLib}`, { cwd: targetIosLibDir, stdio: 'inherit' });
  exec(`ln -s ${krakenAndroidLib}`, { cwd: targetAndroidLibDir, stdio: 'inherit' });
  exec(`ln -s ${thirdPartyDir}`, {cwd: targetDir, stdio: 'inherit'});
}

module.exports = configureProject;
