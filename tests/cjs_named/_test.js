go(["_reporter", "require"], function(amdJS, require) {

  require(['car'],
  function (car) {
    amdJS.assert('car' === car.name, 'cjs_named: car.name');
    amdJS.assert('wheels' === car.wheels.name, 'cjs_named: car.wheels.name');
    amdJS.assert('engine' === car.engine.name, 'cjs_named: car.engine.name');
    amdJS.print('DONE', 'done');
  });

});