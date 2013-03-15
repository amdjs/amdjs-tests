config({
  paths: {
    "array": "impl/array"
  }
});

go(     ["_reporter", "require", "array"],
function (amdJS,       require,   array) {
    amdJS.assert('impl/array' === array.name, 'anon_relative: array.name');
    amdJS.assert('util' === array.utilName, 'anon_relative: relative to module ID, not URL');
    amdJS.print('DONE', 'done');
});
