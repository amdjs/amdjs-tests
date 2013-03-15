config({
  baseUrl: '.',
  paths: {
    'foo/b': 'alternate/b',
    'foo/b/c': 'elsewhere/c'
  }
});

go(     ["_reporter", "foo", "foo/b", "foo/b/c", "bar", "bar/sub"],
function (amdJS,       foo,   fooB,    fooC,      bar,   barSub) {
  amdJS.assert('foo' === foo.name, 'config_paths: foo.name');
  amdJS.assert('fooB' === fooB.name, 'config_paths: fooB.name');
  amdJS.assert('fooC' === fooC.name, 'config_paths: fooC.name');
  amdJS.assert('bar' === bar.name, 'config_paths: bar.name');
  amdJS.assert('barSub' === barSub.name, 'config_paths: barSub.name');
  amdJS.print('DONE', 'done');
});
