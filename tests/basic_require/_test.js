go(["_reporter"], function(amdJS) {

  go(     ['require', 'a'],
  function (require) {
    require(['b', 'c'],
    function (b,   c) {
      amdJS.assert('a' === require('a').name, 'basic_require: require a.name');
      amdJS.assert('b' === b.name, 'basic_require: b.name');
      amdJS.assert('c' === c.name, 'basic_require: c.name');
      amdJS.assert(/c\/templates\/first\.txt$/.test(c.url), 'basic_require: c.url property');
      amdJS.print('DONE', 'done');
    });
  });

});