go(["_reporter", "require"], function(amdJS, require) {
  
  config({
    paths: {
      "array": "impl/array"
    }
  });

  require(["require", "array"],
  function (require,   array) {
    amdJS.assert('impl/array' === array.name, 'anon_relative: array.name');
    amdJS.assert('util' === array.utilName, 'anon_relative: relative to module ID, not URL');
    amdJS.print('DONE', 'done');
  });

});