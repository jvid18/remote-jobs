const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// htmlparser2 imports the subpath `entities/decode`, exposed only through the
// `entities` package's conditional `exports` map. Metro ignores `exports` by
// default, so enable it to let the resolver honor those subpath maps.
config.resolver.unstable_enablePackageExports = true

module.exports = config
