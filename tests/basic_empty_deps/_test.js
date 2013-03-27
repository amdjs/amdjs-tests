go(["_reporter", "require"], function(amdJS, require) {

  function emptyDeps(then) {
    define('emptyDeps', [], function() {
      amdJS.assert(arguments.length === 0, 'basic_empty_deps: [] should be treated as no dependencies instead of the default require, exports, module');
      then();
    });
  }

  function noDeps(then) {
    define('noDeps', function(require, exports, module) {
      amdJS.assert(typeof(require) === 'function', 'basic_empty_deps: no dependencies case uses require in first slot. Is a function');
      amdJS.assert(typeof(exports) === 'object', 'basic_empty_deps: no dependencies case uses exports in second slot. Is an object.');
      amdJS.assert(typeof(module) === 'object', 'basic_empty_deps: no dependencies case uses module in third slot. Is an object.');
      then();
    });
  }

  // this nesting structure ensures that the AMD define will resolve
  // before we call the next by after the tests are ran in each use
  // case. We use named define calls to ensure there are not module
  // conflicts or mismatches that can occur using anonymous modules.
  emptyDeps(function () {
    window.setTimeout(function () {
      noDeps(function () {
        window.setTimeout(function () {
          amdJS.print('DONE', 'done');
        });
      });
    });
  });
  
});