go(["_reporter"], function(amdJS) {

  go(     ['a', 'b'],
  function (a,   b) {
    amdJS.assert('a' === a.name, 'basic_simple: a.name');
    amdJS.assert('b' === b.name, 'basic_simple: b.name');
    amdJS.assert('c' === b.cName, 'basic_simple: c.name via b');
    amdJS.print('DONE', 'done');
  });

});