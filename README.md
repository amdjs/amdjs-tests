# AMD Tests

A set of Asynchronous Module Definition
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compliance
tests.

The tests come with a built in harness for the browser, but can be ran in any JS environment. All that is required is an amdJS global object with a `print()` method.

# Configuration

An implementation needs to have the following two files in the **impl** directory:

* AMD loader implementation
* configure script

The configure script should define the following global variables:

* **config**: a function that accepts configuration parameters. Similar to the
RequireJS form of require({}).

* **go**: a function that implements the top level, global function that starts
loading of modules. Equivalent to the RequireJS global require([], function(){})
signature.

* implemented: an object whose properties are the types of tests that the
loader expects to pass.

# Test Types

Each test type builds on the other: supporting later test types implies support
for earlier test types.

## basic

Very basic loading of named modules that have dependency arrays.

* Support for define.amd to indicate an AMD loader.
* Named modules.
* Dependency arrays.
* Circular dependency support via the "exports" and "require" dependency.
* Test for the CommonJS "module" dependency.

## require

Basic require() support, in accordance with the [amdjs require API](https://github.com/amdjs/amdjs-api/wiki/require):

* require(String)
* require(Array, Function)
* require.toUrl(String)

## anon

Similar tests to **basic**, but using anonymous modules.

## funcString

Tests parsing of definition functions via Function.prototype.toString() to
get out dependencies. Used to support simplified CommonJS module wrapping:

```javascript
    define(function (require) {
        var a = require('a');
        //Return the module definition.
        return {};
    });
```

## namedWrapped

Similar to the **funcString** tests, but using named modules.

```javascript
    define('some/module', function (require) {
        var a = require('a');
        //Return the module definition.
        return {};
    });
```

## plugins

Support for loader plugins.

* Calling the same plugin resource twice and getting the same value.
* Testing a plugin that implements normalize().
* Testing a plugin that uses load.fromText().

## pluginDynamic

Support for loader plugins that use dynamic: true to indicate their resources
should not be cached by the loader. Instead the loader should call the plugin's
load() method for each instance of a dependency that can be loaded by the plugin.

## packagesConfig

Support for the [common config API](https://github.com/amdjs/amdjs-api/wiki/Common-Config) section on [map config](https://github.com/amdjs/amdjs-api/wiki/Common-Config#wiki-packages).

## mapConfig

Support for the [common config API](https://github.com/amdjs/amdjs-api/wiki/Common-Config) section on [map config](https://github.com/amdjs/amdjs-api/wiki/Common-Config#wiki-map).

## moduleConfig

Support for the [common config API](https://github.com/amdjs/amdjs-api/wiki/Common-Config) section on [module config](https://github.com/amdjs/amdjs-api/wiki/Common-Config#wiki-config).

## shimConfig

Support for the [common config API](https://github.com/amdjs/amdjs-api/wiki/Common-Config) section on [shim config](https://github.com/amdjs/amdjs-api/wiki/Common-Config#wiki-shim).

# Running the tests

```sh
npm install
node server/server.js
```

And visit http://localhost:4000 to get started

# License

amdjs-tests is released under two licenses: new BSD, and MIT. See the LICENSE
file for more info.

The individual loader implementations are subject to their own specific
licenses. This license only covers the tests.
