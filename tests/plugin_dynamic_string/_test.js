go(["_reporter", "require"], function(amdJS, require) {

  require(['mattress'],
  function (mattress) {
    //Make sure the resource names do not match for the
    //three kinds of pillow-related resources.
    amdJS.assert('mattress' === mattress.name, 'plugin_dynamic_string: mattress.name is unique');
    amdJS.assert('1:medium' === mattress.id1, 'plugin_dynamic_string: mattress.id1 is unique');
    amdJS.assert('2:medium' === mattress.id2, 'plugin_dynamic_string: mattress.id2 is unique');
    amdJS.print('DONE', 'done');
  });

});