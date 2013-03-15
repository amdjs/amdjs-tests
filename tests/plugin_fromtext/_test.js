go(["_reporter", "require"], function(amdJS, require) {

  require(['refine!a'],
  function (a) {
    amdJS.assert('a' === a.name, 'plugin_fromtext: a.name');
    amdJS.print('DONE', 'done');
  });

});