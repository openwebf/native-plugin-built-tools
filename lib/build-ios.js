const exec = require('child_process').execSync;
const path = require('path');

const iosToolChainFile = path.join(__dirname, '../cmake/ios.toolchain.cmake');

function buildIOS(root, projectName) {
  exec(`cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DCMAKE_TOOLCHAIN_FILE=${iosToolChainFile} \
  -DPLATFORM=SIMULATOR64 \
  -DENABLE_BITCODE=FALSE -G "Unix Makefiles" \
  -B ${root}/cmake-build-ios-x64 -S ${root}`, {
    cwd: root,
    env: {
      ...process.env,
      KRAKEN_JS_ENGINE: 'jsc'
    },
    stdio: 'inherit'
  });
  exec(`cmake --build ${root}/cmake-build-ios-x64 --target ${projectName} -- -j 4`, {stdio: 'inherit'});

  exec(`cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DCMAKE_TOOLCHAIN_FILE=${iosToolChainFile} \
  -DPLATFORM=OS \
  -DENABLE_BITCODE=FALSE -G "Unix Makefiles" \
  -B ${root}/cmake-build-arm -S ${root}`, {
    cwd: root,
    env: {
      ...process.env,
      KRAKEN_JS_ENGINE: 'jsc'
    },
    stdio: 'inherit'
  });
  exec(`cmake --build ${root}/cmake-build-arm --target ${projectName} -- -j 4`, {stdio: 'inherit'});

  exec(`cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DCMAKE_TOOLCHAIN_FILE=${iosToolChainFile} \
  -DPLATFORM=OS64 \
  -DENABLE_BITCODE=FALSE -G "Unix Makefiles" \
  -B ${root}/cmake-build-arm64 -S ${root}`, {
    cwd: root,
    env: {
      ...process.env,
      KRAKEN_JS_ENGINE: 'jsc'
    },
    stdio: 'inherit'
  });
  exec(`cmake --build ${root}/cmake-build-arm64 --target ${projectName} -- -j 4`, {stdio: 'inherit'});

  const x86SDKPATH = path.join(root, `cmake-build-ios-x64/lib${projectName}_jsc.dylib`);
  const armSDKPATH = path.join(root, `cmake-build-arm/lib${projectName}_jsc.dylib`);
  const arm64SDKPATH = path.join(root, `cmake-build-arm64/lib${projectName}_jsc.dylib`);

  const targetSDKPATH = path.join(root, `../ios/lib${projectName}_jsc.dylib`);

  exec(`lipo -create ${x86SDKPATH} ${armSDKPATH} ${arm64SDKPATH} -output ${targetSDKPATH}`, { stdio: 'inherit' });
  exec(`dsymutil ${targetSDKPATH}`, { stdio: 'inherit'});
  exec(`strip -S -X -x ${targetSDKPATH}`, {stdio: 'inherit'});
}

module.exports = buildIOS;
