'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.log = console.log;
    exports.trace = console.trace;

    return exports;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.loggingUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
