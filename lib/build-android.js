const exec = require('child_process').execSync;
const path = require('path');
const fs = require('fs');

function buildAndroid(root, projectName) {
  const androidHome = path.join(process.env.HOME, 'Library/Android/sdk');
  if (!fs.existsSync(androidHome)) {
    throw new Error('Android SDK not Installed.');
  }

  const ndkDir = path.join(androidHome, 'ndk');
  let installedNDK = fs.readdirSync(ndkDir).filter(d => d[0] != '.');
  if (installedNDK.length == 0) {
    throw new Error('Android NDK not Found. Please install one');
  }
  const ndkModule = path.join(ndkDir, installedNDK[0]);

  exec(`cmake -DCMAKE_BUILD_TYPE=relwithdebinfo -DCMAKE_TOOLCHAIN_FILE=${ndkModule}/build/cmake/android.toolchain.cmake \
  -DANDROID_NDK=${ndkModule} \
  -DIS_ANDROID=TRUE \
  -DANDROID_ABI="arm64-v8a" \
  -DANDROID_PLATFORM="android-16" \
  -DANDROID_STL=c++_shared \
  -G "Unix Makefiles" \
  -B ${root}/cmake-build-android-arm64 -S ${root}`, {
    cwd: root,
    env: {
      ...process.env,
      KRAKEN_JS_ENGINE: 'jsc'
    },
    stdio: 'inherit'
  });
  exec(`cmake --build ${root}/cmake-build-android-arm64 --target ${projectName} -- -j 4`, {stdio: 'inherit'});

  exec(`cmake -DCMAKE_BUILD_TYPE=relwithdebinfo -DCMAKE_TOOLCHAIN_FILE=${ndkModule}/build/cmake/android.toolchain.cmake \
  -DANDROID_NDK=${ndkModule} \
  -DIS_ANDROID=TRUE \
  -DANDROID_ABI="armeabi-v7a" \
  -DANDROID_PLATFORM="android-16" \
  -DANDROID_STL=c++_shared \
  -B ${root}/cmake-build-android-arm -S ${root}`, {
    cwd: root,
    env: {
      ...process.env,
      KRAKEN_JS_ENGINE: 'jsc'
    },
    stdio: 'inherit'
  });
  exec(`cmake --build ${root}/cmake-build-android-arm --target ${projectName} -- -j 4`, {stdio: 'inherit'});
}

module.exports = buildAndroid;
