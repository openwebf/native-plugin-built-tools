set(CMAKE_OSX_DEPLOYMENT_TARGET 10.11)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if ($ENV{KRAKEN_JS_ENGINE} MATCHES "jsc")
    add_compile_options(-DKRAKEN_JSC_ENGINE=1)
    list(APPEND BRIDGE_INCLUDE ${CMAKE_CURRENT_SOURCE_DIR}/kraken/third_party/)
    if (EXISTS ${DEBUG_JSC_ENGINE})
      add_compile_options(-DENABLE_DEBUGGER=1)
      list(APPEND BRIDGE_INCLUDE ${DEBUG_JSC_ENGINE}/Headers)
      add_library(JavaScriptCore SHARED IMPORTED)
      set_target_properties(JavaScriptCore PROPERTIES IMPORTED_LOCATION ${DEBUG_JSC_ENGINE}/JavaScriptCore)
      list(APPEND BRIDGE_LINK_LIBS JavaScriptCore)
    elseif (${IS_ANDROID})
        add_library(JavaScriptCore SHARED IMPORTED)
        set_target_properties(JavaScriptCore PROPERTIES IMPORTED_LOCATION
                "${CMAKE_CURRENT_SOURCE_DIR}/kraken/lib/android/jniLibs/${ANDROID_ABI}/libjsc.so"
                )
        list(APPEND BRIDGE_LINK_LIBS JavaScriptCore)
    else()
        list(APPEND BRIDGE_LINK_LIBS "-framework JavaScriptCore")
    endif()
endif()

list(APPEND BRIDGE_INCLUDE ${CMAKE_CURRENT_SOURCE_DIR}/third_party)

if (${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
    add_library(kraken SHARED IMPORTED)
    set_target_properties(kraken PROPERTIES IMPORTED_LOCATION "${CMAKE_CURRENT_SOURCE_DIR}/kraken/lib/macos/libkraken_jsc.dylib")
elseif(${CMAKE_SYSTEM_NAME} MATCHES "iOS")
    add_library(kraken SHARED IMPORTED)
    set_target_properties(kraken PROPERTIES IMPORTED_LOCATION "${CMAKE_CURRENT_SOURCE_DIR}/kraken/lib/ios/kraken_bridge.framework/kraken_bridge")
elseif(${CMAKE_SYSTEM_NAME} MATCHES "Android")
    add_library(kraken SHARED IMPORTED)
    set_target_properties(kraken PROPERTIES IMPORTED_LOCATION "${CMAKE_CURRENT_SOURCE_DIR}/kraken/lib/android/jniLibs/${ANDROID_ABI}/libkraken_jsc.so")
endif()


