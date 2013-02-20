go(["_reporter"], function(amdJS) {

  amdJS.assert(typeof define.amd === 'object', 'basic_define: define.amd is object');
  amdJS.print('DONE', 'done');
  
});