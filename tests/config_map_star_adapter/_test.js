config({
  baseUrl: './',
  map: {
    '*': {
      'd': 'adapter/d'
    },
    'adapter/d': {
      d: 'd'
    }
  }
});

go(["_reporter", "require"], function(amdJS, require) {

  require(['e', 'adapter/d'],
  function (e,   adapterD) {
    'use strict';
    amdJS.assert('e' === e.name, 'config_map_star_adapter: e.name');
    amdJS.assert('d' === e.d.name, 'config_map_star_adapter: e.d.name');
    amdJS.assert(e.d.adapted, 'config_map_star_adapter: e.d.adapted');
    amdJS.assert(adapterD.adapted, 'config_map_star_adapter: adapterD.adapted');
    amdJS.assert('d' === adapterD.name, 'config_map_star_adapter: adapterD.name');
    amdJS.print('DONE', 'done');
  });

});