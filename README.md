# AMD Tests

This is the start of Asynchronous Module Definition
[AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) compliance
tests.

Right now the tests only run in the browser, but it will be possible to run
them in Node and Rhino.

# Configuration

An implementation needs to have the following two files:

* AMD loader implementation
* configure script

The configure script should define the following variables:

* **config**: a function that accepts configuration parameters. Similar to the
RequireJS form of require({}).

* **go**: a function that implements the top level, global function that starts
loading of modules. Equivalent to the RequireJS global require([], function(){})
signature.

* implemented: an object whose properties are the types of tests that the
loader expects to pass.

The full list of test types:

* **basic**: Very basic loading of named modules that have dependency arrays.

TODO: Add more.

# Running the tests

Run the tests through a web server. The URL should look like the following:

    http://127.0.0.1/amd-tests/tests/doh/runner.html?testUrl=../bootstrap&config=path/to/confi.js&impl=path/to/loader.js

To run the tests using the version of RequireJS in this repository:

    http://127.0.0.1/amd-tests/tests/doh/runner.html?testUrl=../bootstrap&config=../../impl/requirejs/config.js&impl=../../impl/requirejs/require.js
