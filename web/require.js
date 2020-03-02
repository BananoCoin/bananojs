
const require = (modname) => {
  const module = requireRaw(modname);
  if (module) {
    return module;
  } else {
    throw Error(`undefined module:'${modname}'`);
  }
};
const requireRaw = (modname) => {
  if (modname == './banano-util.js') {
    return window.bananoUtil;
  }
  if (modname == './app/scripts/banano-util.js') {
    return window.bananoUtil;
  }
  if (modname == './app/scripts/bananode-api.js') {
    return window.bananodeApi;
  }
  if (modname == './app/scripts/camo-util.js') {
    return window.camoUtil;
  }
  if (modname == './app/scripts/deposit-util.js') {
    return window.depositUtil;
  }
  if (modname == './app/scripts/withdraw-util.js') {
    return window.withdrawUtil;
  }
  if (modname == './app/scripts/logging-util.js') {
    return window.loggingUtil;
  }
  if (modname == '../../libraries/tweetnacl/nacl.js') {
    return window.nacl;
  }
  if (modname == 'blakejs') {
    return window.blakejs;
  }
  if (modname == './blake2bUtil') {
    return window.blake2bUtil;
  }
  if (window[modname]) {
    return window[modname];
  } else {
    throw Error(`unknown module:'${modname}'`);
  }
};
window.https = {};
window.https.request = (url, options, requestWriterCallback) => {
  const LOG_HTTP = false;
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open(options.method, url, true);
  Object.keys(options.headers).forEach((headerName) => {
    if (headerName == 'Content-Length') {
      // skip unsafe header warning
    } else {
      const headerValue = options.headers[headerName];
      xmlhttp.setRequestHeader(headerName, headerValue);
    }
  });
  xmlhttp.timeout = options.timeout;

  const requestWriter = {};
  requestWriter.listeners = {};
  requestWriter.write = (body) => {
    if (LOG_HTTP) {
      console.log('https send', body);
    }
    xmlhttp.send(body);
  };
  requestWriter.end = () => {

  };
  requestWriter.listeners['data'] = () => {
  };
  requestWriter.listeners['error'] = () => {
  };
  requestWriter.on = (key, fn) => {
    requestWriter.listeners[key] = fn;
  };

  requestWriterCallback(requestWriter);

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (LOG_HTTP) {
        console.log('https end', this.responseText);
      }
      if (this.status == 200) {
        const fn = requestWriter.listeners['data'];
        fn(this.responseText);
      } else {
        const fn = requestWriter.listeners['error'];
        const error = {};
        error.responseText = this.responseText;
        error.readyState = this.readyState;
        error.status = this.status;
        fn(error);
      }
    }
  };

  return requestWriter;
};
