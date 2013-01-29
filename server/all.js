document.getElementById('select-framework').onchange = selectFramework;
document.getElementById('run-tests').onclick = runTests;

function selectFramework() {
  var qstr = '?framework=' + document.getElementById('select-framework').value;
  location.href = location.pathname + qstr;
}
function runTests() {
  var using = (implemented) ? implemented : {}; // global
  var nodes;
  var impl;
  var i;
  var len;
  var link;
  var parent;
  var testable;
  var iframe;

  // tag valid tests as testable
  for (impl in using) {
    nodes = document.getElementsByClassName(impl);
    for (i = 0, len = nodes.length; i < len; i++) {
      nodes[i].className += ' testable';
    }
  }

  nodes = document.getElementById('tests').getElementsByTagName('a');
  for (i = 0, len = nodes.length; i < len; i++) {
    link = nodes[i];
    parent = link.parentNode;
    testable = parent.className.indexOf('testable') >= 0;
    if (testable) {
      iframe = document.createElement('iframe');
      iframe.src = link.href;
      parent.insertBefore(iframe, link);
    }
    else {
      iframe = document.createElement('div');
      iframe.className = 'skipped';
      parent.insertBefore(iframe, link);
    }
  }

}