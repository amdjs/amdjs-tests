go(     ["_reporter", "refine!a"],
function (amdJS,       a) {
  amdJS.assert('a' === a.name, 'plugin_fromtext: a.name');
  amdJS.print('DONE', 'done');
});
