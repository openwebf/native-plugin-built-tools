const exec = require('child_process').execSync;
const path = require('path');

function buildMacOS(root, projectName, jscPath) {
  let cmakeExternArgs = [];

  if (jscPath) {
    cmakeExternArgs.push('-DDEBUG_JSC_ENGINE=' + path.join(jscPath, 'macos/JavaScriptCore.framework'));
  }

  exec(`cmake -DCMAKE_MODULE_PATH=${path.join(__dirname, '../cmake')} -DCMAKE_BUILD_TYPE=RelWithDebInfo ${cmakeExternArgs.join(' ')} -G "Unix Makefiles" -B ${root}/cmake-build-relwithdebuginfo -S ${root}`, {
    cwd: root,
    env: {
      ...process.env,
      KRAKEN_JS_ENGINE: 'jsc'
    },
    stdio: 'inherit'
  });
  exec(`cmake --build ${root}/cmake-build-relwithdebuginfo --target ${projectName} -- -j 4`, {stdio: 'inherit'});
  const binaryPath = path.join(root, `../macos/lib${projectName}_jsc.dylib`);
  exec(`dsymutil ${binaryPath}`, {stdio: 'inherit'});
  exec(`strip -S -X -x ${binaryPath}`, { stdio: 'inherit' });
}

module.exports = buildMacOS;
