const path = require('path');
const fs = require('fs');

const getPolyFillHeader = (outputName) => `
#ifndef KRAKEN_${outputName.toUpperCase()}_H
#define KRAKEN_${outputName.toUpperCase()}_H

#include "kraken/include/kraken_bridge.h"

#define KRAKEN_EXPORT_C extern "C" __attribute__((visibility("default"))) __attribute__((used))

KRAKEN_EXPORT_C
void initBridge();

#endif // KRAKEN_${outputName.toUpperCase()}_H
`;

const getPolyFillSource = (projectName, sourceInfo) => {
  let declarations = sourceInfo.map(info => {
    let code = info.code.replace(/\)\"/g, '))") + std::u16string(uR"("');
    return `static std::u16string ${info.name} = std::u16string(uR"(${code})");`
  });

  let codeDeclaration = sourceInfo.map(info => {
    return `NativeString ${info.name}NativeString {
      reinterpret_cast<const uint16_t*>(${info.name}.c_str()),
      (int32_t)${info.name}.size()
    };
    registerPluginSource(&${info.name}NativeString, "${info.name}://");`;
  });

  return `
  #include "${projectName}.h"

  ${declarations.join('\n')}

  void initBridge() {
    ${codeDeclaration.join('\n')}
  }
  `;
};

exports.getPolyFillHeader = getPolyFillHeader;
exports.getPolyFillSource = getPolyFillSource;
