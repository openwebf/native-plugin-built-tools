const exec = require('child_process').execSync;
const path = require('path');
const fs = require('fs');

function buildAndroid(root, projectName, jscPath) {
  const androidHome = path.join(process.env.HOME, 'Library/Android/sdk');
  if (!fs.existsSync(androidHome)) {
    throw new Error('Android SDK not Installed.');
  }

  const ndkDir = path.join(androidHome, 'ndk');
  let installedNDK = fs.readdirSync(ndkDir).filter(d => d[0] != '.');
  if (installedNDK.length == 0) {
    throw new Error('Android NDK not Found. Please install one');
  }

  const ndkVersion = installedNDK.slice(-1)[0];
  if (parseInt(ndkVersion) < 20) {
    throw new Error('Minimium NDK version (20.0.5594570) required.');
  }

  const ndkModule = path.join(ndkDir, ndkVersion);
  const supportedABI = ['arm64-v8a', 'armeabi-v7a'];

  for (let i = 0; i < supportedABI.length; i++) {
    let cmakeExternArgs = [];

    if (jscPath) {
      let dynamicLibsPath = path.join(jscPath, `android/jniLibs/${supportedABI[i]}/libjsc.so`);
      cmakeExternArgs.push('-DDEBUG_JSC_ENGINE=' + dynamicLibsPath);
    }

    exec(`cmake -DCMAKE_MODULE_PATH=${path.join(__dirname, '../cmake')} ${cmakeExternArgs.join(' ')} -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=${ndkModule}/build/cmake/android.toolchain.cmake \
    -DANDROID_NDK=${ndkModule} \
    -DIS_ANDROID=TRUE \
    -DANDROID_ABI="${supportedABI[i]}" \
    -DANDROID_PLATFORM="android-16" \
    -DANDROID_STL=c++_shared \
    -G "Unix Makefiles" \
    -B ${root}/cmake-build-android-${supportedABI[i]} -S ${root}`, {
      cwd: root,
      env: {
        ...process.env,
        KRAKEN_JS_ENGINE: 'jsc'
      },
      stdio: 'inherit'
    });
    exec(`cmake --build ${root}/cmake-build-android-${supportedABI[i]} --target ${projectName} -- -j 4`, { stdio: 'inherit' });

    exec(`${ndkModule}/toolchains/llvm/prebuilt/darwin-x86_64/bin/llvm-strip --strip-all ${path.join(root, `../android/jniLibs/${supportedABI[i]}/lib${projectName}_jsc.so`)}`);
  }
}

module.exports = buildAndroid;
