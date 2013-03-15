config({
  baseUrl: './',
  paths: {
    'alpha/replace' : 'replace'
  },
  packages: [
    {
      name: 'alpha',
      location: 'pkgs/alpha'
    },
    {
      name: 'beta',
      location: 'pkgs/beta/0.2/scripts',
      main: 'beta'
    },
    {
      name: 'dojox/chair',
      location: 'pkgs/dojox/chair'
    },
    {
      name: 'dojox/table',
      location: 'pkgs/dojox/table',
      main: 'table'
    },
    {
      name: 'bar',
      location: 'bar/0.4',
      main: 'scripts/main'
    },
    {
      name: 'foo',
      location: 'foo/lib'
    },
    {
      name: 'funky',
      main: 'index.js'
    },
    {
      name: 'baz',
      location: 'baz/lib',
      main: 'index'
    },
    {
      name: 'dojox/window',
      location: 'dojox/window',
      main: 'window'
    }
  ]
});

go([
  "_reporter",
  "require",
  "alpha",
  "alpha/replace",
  "beta",
  "beta/util",
  "bar",
  "baz",
  "foo",
  "foo/second",
  "dojox/chair",
  "dojox/table",
  "dojox/door",
  "dojox/window/pane",
  "dojox/window",
  "dojox/table/legs",
  "funky"],
  function (amdJS, require, alpha, replace, beta, util, bar, baz, foo, second,
    chair, table, door, pane, window, legs, funky) {

    amdJS.assert('alpha' === alpha.name, 'config_packages: alpha.name');
    amdJS.assert('fake/alpha/replace' === replace.name, 'config_packages: replace.name');
    amdJS.assert('beta' === beta, 'config_packages: beta');
    amdJS.assert('beta/util' === util.name, 'config_packages: util.name');
    amdJS.assert('bar' === bar.name, 'config_packages: bar.name');
    amdJS.assert('0.4' === bar.version, 'config_packages: bar.version');
    amdJS.assert('baz' === baz.name, 'config_packages: baz.name');
    amdJS.assert('0.4' === baz.barDepVersion, 'config_packages: baz.barDepVersion');
    amdJS.assert('foo' === baz.fooName, 'config_packages: baz.fooName');
    amdJS.assert('baz/helper' === baz.helperName, 'config_packages: baz.helperName');
    amdJS.assert('foo' === foo.name, 'config_packages: foo.name');
    amdJS.assert('alpha' === foo.alphaName, 'config_packages: foo.alphaName');
    amdJS.assert('foo/second' === second.name, 'config_packages: second.name');
    amdJS.assert('dojox/chair' === chair.name, 'config_packages: chair.name');
    amdJS.assert('dojox/chair/legs' === chair.legsName, 'config_packages: chair.legsName');
    amdJS.assert('dojox/table' === table.name, 'config_packages: table.name');
    amdJS.assert('dojox/chair' === table.chairName, 'config_packages: table.chairName');
    amdJS.assert('dojox/table/legs' === legs.name, 'config_packages: legs.name');
    amdJS.assert('dojox/door' === door.name, 'config_packages: door.name');
    amdJS.assert('dojox/window/pane' === pane.name, 'config_packages: pane.name');
    amdJS.assert('dojox/window' === window.name, 'config_packages: window.name');
    amdJS.assert('dojox/window/pane' === window.paneName, 'config_packages: window.paneName');
    amdJS.assert('funky' === funky.name, 'config_packages: funky.name');
    amdJS.assert('monkey' === funky.monkeyName, 'config_packages: funky.monkeyName');
    amdJS.print('DONE', 'done');
  }
);
