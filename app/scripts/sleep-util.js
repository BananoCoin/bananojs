'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const sleep = ( millis ) => {
    return new Promise( (resolve) => setTimeout( resolve, millis ) );
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.sleep = sleep;
    return exports;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananodeApi = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
