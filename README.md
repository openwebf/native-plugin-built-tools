## Kraken Native-Plugin-Build-Tool

kraken native(C/C++) plugin build tool is a useful tool when you work with C/C++ and JavaScript source file in Kraken plugin development.

It can generate CMake projects to support the development of Kraken native plugin addons.

## Support platforms
1. macOS

## Install

```bash
npm install -g kraken-npbt
```

## Requirement

1. CMake version > 3.2.0
2. XCode installed
3. Android SDK Installed at `~/Library/Android/sdk`

## Usage

To compile your native addon, first go to your kraken plugin directory.

```bash
cd your_kraken_plugin
```

The next step is to generate the appropriate project build files. Use configure for that:

```bash
kraken-npbt configure
```

All configure files will generated at your_kraken_plugin/bridge folder.

**Note:** `kraken-npbt` will search all C/C++ source files and JavaScripts files under `your_kraken_plugin/bridge` folder and manage all deps for you.

when you add new files at `your_kraken_plugin/bridge`, just re-run `kraken-npbt configure` to make compile works.

Now you will have a CMakeLists.txt in the `your_kraken_plugin/bridge` directory. Next, invoke the build command:

```bash
kraken-npbt build
```

Now you have your compiled library file! And your compiled file will automatic copy to the following folders:

- **macOS:** `your_kraken_plugin/macos/your_plugin.dylib`
- **iOS:** `your_kraken_plugin/ios/your_plugin.dylib`
- **android:** `your_kraken_plugin/android/jniLibs/${ANDROID_ABI}/your_plugin.so`

To let your compiled library file will be embedded in your App. Make sure add to following configurations:

**macOS:**

**your_kraken_plugin/macos/your_kraken_plugin.pubspec**
```
  s.vendored_libraries = 'your_kraken_plugin_jsc.dylib'
```

**iOS:**
**your_kraken_plugin/ios/your_kraken_plugin.pubspec**

```
  s.vendored_libraries = 'your_kraken_plugin_jsc.dylib'
```

**Android:**
**your_kraken_plugin/android/build.gradle**

```gradle
android {
    sourceSets {
        main {
            jniLibs.srcDirs = ['jniLibs']
        }
    }
}
```
