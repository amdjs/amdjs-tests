config({
  baseUrl: './',
  config: {
    a: {
      id: 'magic'
    },
    'b/c': {
      id: 'beans'
    }
  }
});

go(["_reporter", "require"], function(amdJS, require) {

  require(['a', 'b/c', 'plain'],
  function (a,   c,     plain) {
    amdJS.assert('magic' === a.type, 'config_module: a.type is magic');
    amdJS.assert('beans' === c.food, 'config_module: c.food is beans');
    amdJS.assert('plain' === plain.id, 'config_module: module.id is defined');
    amdJS.print('DONE', 'done');
  });

});