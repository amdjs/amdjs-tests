go(["_reporter"], function(amdJS) {

  config({
    baseUrl: './',
    paths: {
      a: 'a1'
    },

    map: {
      '*': {
        'c': 'another/c'
      },
      'a': {
        c: 'c1'
      },
      'a/sub/one': {
        'c': 'c2',
        'c/sub': 'another/c/sub'
      }
    }
  });
  go(    ['a', 'b', 'c', 'a/sub/one'],
  function(a,   b,   c,   one) {
    amdJS.assert('c1' === a.c.name, 'config_map_star: a.c.name');
    amdJS.assert('c1/sub' === a.csub.name, 'config_map_star: a.csub.name');
    amdJS.assert('c2' === one.c.name, 'config_map_star: one.c.name');
    amdJS.assert('another/c/sub' === one.csub.name, 'config_map_star: one.csub.name');
    amdJS.assert('another/c/dim' === one.csub.dimName, 'config_map_star: one.csub.dimName');
    amdJS.assert('another/c' === b.c.name, 'config_map_star: b.c.name');
    amdJS.assert('another/minor' === b.c.minorName, 'config_map_star: b.c.minorName');
    amdJS.assert('another/c/sub' === b.csub.name, 'config_map_star: b.csub.name');
    amdJS.assert('another/c' === c.name, 'config_map_star: c.name');
    amdJS.assert('another/minor' === c.minorName, 'config_map_star: c.minorName');
    amdJS.print('DONE', 'done');
  });

});