
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
