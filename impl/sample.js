/*
These are all the currently supported tests

Use it as a template for your own impl
*/

var config, go, implemented;

// config is a way to set up configuration for AMD tests
config = function () {};

// map this to your loader's entry point
go = function () {};

// comment out the tests you don't need
implemented = {
  basic: true,
  anon: true,
  funcString: true,
  namedWrapped: true,
  require: true,

  // plugin support
  plugins: true,
  pluginDynamic: true,

  // config proposal
  pathsConfig: true,
  packagesConfig: true,
  mapConfig: true,
  moduleConfig: true,
  shimConfig: true
};