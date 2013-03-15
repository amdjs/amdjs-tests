go(["_reporter", "require"], function(amdJS, require) {
  var count = 0;
  var timeout = 10000;

  var timer = window.setTimeout(function() {
    amdJS.assert(false, 'plugin_double: test timed out');
    amdJS.print('DONE', 'done');
  }, timeout);

  var done = function() {
    count++;
    if (count === 2) {
      window.clearTimeout(timer);
      amdJS.assert(true, 'plugin_double: double plugin called okay');
      amdJS.print('DONE', 'done');
    }
  };

  require(['double!foo'],
  function (foo) {
    if (foo === 'x') {
      done();
    }
  });

  require(['double!foo'],
  function (foo) {
    if (foo === 'x') {
      done();
    }
  });

});