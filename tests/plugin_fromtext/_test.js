go(["_reporter"], function(amdJS) {

  go(     ['refine!a'],
  function (a) {
    amdJS.assert('a' === a.name, 'plugin_fromtext: a.name');
    amdJS.print('DONE', 'done');
  });

});