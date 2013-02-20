/*
ABOUT THIS FILE
===============
This file is the JS driver for the test running interface. Its main purpose
is selecting a test from the suite list, performing the "runTests" operation,
and reporting back for the sake of its own Travis-CI runner.

On boot, it tags tests as valid based on the window.implemented from a
framework's test config.

The global amdJSSignal object will listen for a failure and flag tests
as failed or complete.

Finally, calling a framework with &autorun=true will start the tests
automatically, again for Travis-CI.
*/

document.getElementById('select-framework').onchange = selectFramework;
document.getElementById('run-tests').onclick = runTests;
var autoRun = (location.search.indexOf('autorun=true') != -1) ? true : false;
var groupings = {};
var expectedDone = 0;
var failed = false;
var travisResult = document.createElement('div');

var globalTimeout = window.setTimeout(function() {
  failed = true;
  travisResult.innerHTML = 'fail';
  document.body.appendChild(travisResult);
});

travisResult.id = 'travis-results';

// tag valid tests as testable
// we give it a "testable" class. We then add a bunch of
// pending DIVs until test execution fires
if (window.implemented) {
  for (impl in implemented) {
    nodes = document.getElementsByClassName(impl);
    for (i = 0, len = nodes.length; i < len; i++) {
      nodes[i].className += ' testable';
      iframe = document.createElement('div');
      iframe.className = 'skipped';
      nodes[i].insertBefore(iframe, nodes[i].firstChild);
    }
  }
}

// selects a framework
function selectFramework() {
  var qstr = '?framework=' + document.getElementById('select-framework').value;
  location.href = location.pathname + qstr;
}

// runs the test collection
function runTests() {
  document.getElementById('run-tests').disabled = true;
  
  var using = (implemented) ? implemented : {}; // global
  var nodes;
  var impl;
  var i;
  var len;
  var link;
  var parent;
  var testable;
  var iframe;

  groupings = {};
  nodes = [].slice.apply(document.getElementById('tests').getElementsByTagName('a'));
  failed = false;

  for (i = 0, len = nodes.length; i < len; i++) {
    link = nodes[i];
    parent = link.parentNode;
    testable = parent.className.indexOf('testable') >= 0;
    if (testable) {
      expectedDone++;
      if (parent.getElementsByTagName('div')[0]) {
        parent.removeChild(parent.getElementsByTagName('div')[0]);
      }
      iframe = document.createElement('iframe');
      iframe.src = link.href;
      parent.insertBefore(iframe, link);
    }
  }
}

// todo: implement these to handle the reporter's explcit AMD signalling
window.amdJSSignal = {
  pass: function() {},
  fail: function() {
    failed = true;
    travisResult.innerHTML = 'fail';
    document.body.appendChild(travisResult);
  },
  done: function() {
    expectedDone--;
    if (expectedDone <= 0 && !failed) {
      window.clearTimeout(globalTimeout);
      travisResult.innerHTML = 'pass';
      document.body.appendChild(travisResult);
    }
  }
};

// do an autorun if enabled by query string
if (autoRun) {
  window.setTimeout(function() {
    runTests();
  }, 10);
}