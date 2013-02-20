go(["_reporter"], function(amdJS) {

  config({
    baseUrl: './',
    shim: {
      a: {
        exports: 'A.name',
        init: function () {
          window.globalA = this.A.name;
        }
      },
      'b': ['a', 'd'],
      'c': {
        deps: ['a', 'b'],
        exports: 'C'
      },
      'e': {
        exports: 'e.nested.e',
        init: function () {
          return {
            name: e.nested.e.name + 'Modified'
          };
        }
      },
      'f': {
        deps: ['a'],
        init: function (a) {
          return {
            name: FCAP.name,
            globalA: FCAP.globalA,
            a: a
          };
        }
      }
    }
  });

  go(    ['a', 'c', 'e', 'f'],
  function(a,   c,   e,   f) {
    amdJS.assert('a' === a, 'config_shim: a');
    amdJS.assert('a' === window.globalA, 'config_shim: window.globalA');
    amdJS.assert('a' === c.b.aValue, 'config_shim: c.b.aValue');
    amdJS.assert('b' === c.b.name, 'config_shim: c.b.name');
    amdJS.assert('c' === c.name, 'config_shim: c.name');
    amdJS.assert('d' === c.b.dValue.name, 'config_shim: c.b.dValue.name');
    amdJS.assert('eModified' === e.name, 'config_shim: e.name');
    amdJS.assert('FCAP' === f.name, 'config_shim: f.name');
    amdJS.assert('a' === f.globalA.name, 'config_shim: f.globalA.name');
    amdJS.assert('a' === f.a, 'config_shim: f.a');
    amdJS.print('DONE', 'done');
  });

});