go(["_reporter", "require"], function(amdJS, require) {

  config({
    baseUrl: './',
    paths: {
      a: 'a1'
    },
    map: {
      'a': {
        c: 'c1'
      },
      'a/sub/one': {
        'c': 'c2'
      }
    }
  });

  require(['a', 'b', 'c', 'a/sub/one'],
  function (a,   b,   c,   one) {
    amdJS.assert('c1' === a.c.name, 'config_map: a.c.name');
    amdJS.assert('c1/sub' === a.csub.name, 'config_map: a.csub.name');
    amdJS.assert('c2' === one.c.name, 'config_map: one.c.name');
    amdJS.assert('c2/sub' === one.csub.name, 'config_map: one.csub.name');
    amdJS.assert('c' === b.c.name, 'config_map: b.c.name');
    amdJS.assert('c/sub', b.csub.name, 'config_map: b.csub.name');
    amdJS.assert('c' === c.name, 'config_map: c.name');
    amdJS.print('DONE', 'done');
  });

});