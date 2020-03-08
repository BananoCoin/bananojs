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

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.sleepUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
