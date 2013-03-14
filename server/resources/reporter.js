/*
 * This file bridges the standard AMD-JS test suite with the simple
 * browser runner. We proxy the go() method, and then we implement
 * the window.amdJSPrint method as per the specification.
 *
 * The proxy of go() allows us to manage a timeout for the test
 * in case there is a deep problem with the loader itself 
 * (read: even require() is broken)
 *
 * The amdJSPrint method pushes data to the top-level window.console
 * as well as registering its suite result with the parent
 */
(function(scope) {
  // load me after your AMD implementation that provides
  // "go", "config", and "implemented"
  (function() {
    var oldGo = window.go;
    var stopStack = [];
    var pass = true;

    // resolve the test to a background color
    var resolve = function() {
      document.body.style.backgroundColor = (pass) ? 'green' : 'red';
    };

    // override go() with a start/stop timer
    window.go = function () {
      var newArgs = [].splice.call(arguments, 0);
      var fn = newArgs[newArgs.length - 1];

      stopStack.push(window.setTimeout(function() {
        window.amdJSPrint('Test timed out: ' + newArgs.join(';'), 'fail');
      }, 3000));
      newArgs[newArgs.length - 1] = function () {
        fn.apply(undefined, arguments);
        window.clearTimeout(stopStack.pop());
        resolve();
      };

      oldGo.apply(window, newArgs);
    };

    // print causes a console log event
    // on first fail, we flag as red
    window.amdJSPrint = function (message, type) {
      var fullMessage = type + '    ' + message;
      window.top.console.log(fullMessage);

      if (window.top.amdJSSignal) {
        if (type === 'fail') {
          window.top.amdJSSignal.fail(message);
        }
        else if (type === 'done') {
          window.top.amdJSSignal.done();
        }
      }

      if (type === 'fail') {
        pass = false;
        resolve();
      }
    };
  })();
})(this);