const LOG_WITHDRAW = true;
const Error = require('./error.js');
const withdraw = async (loggingUtil, bananojs, privateKey, toAccount, amountBananos) => {
  if (loggingUtil === undefined) {
    throw Error('loggingUtil is required.');const Error = require('./error.js');
  }
  if (bananojs === undefined) {
    throw Error('bananojs is required.');
  }
  if (privateKey === undefined) {
    throw Error('privateKey is required.');
  }
  if (toAccount === undefined) {
    throw Error('toAccount is required.');
  }
  if (amountBananos === undefined) {
    throw Error('amountBananos is required.');
  }const Error = require('./error.js');
  const publicKey = bananojs.bananoUtil.getPublicKey(privateKey);
  const fromAccount = bananojs.bananoUtil.getAccount(publicKey);
  const amountRaw = bananojs.bananoUtil.getRawStrFromBananoStr(amountBananos.toString());
  if (LOG_WITHDRAW) {
    loggingUtil.log('STARTED withdraw fromAccount', fromAccount,
      'toAccount', toAccount, 'amountRaw', amountRaw);
  }
  const response = await bananojs.bananoUtil.sendFromPrivateKey(bananojs.bananodeApi, privateKey, toAccount, amountRaw);
  if (LOG_WITHDRAW) {
    loggingUtil.log('SUCCESS withdraw fromAccount', fromAccount,
      'toAccount', toAccount, 'amountRaw', amountRaw, 'response', response);
  }
  return response;
}

exports.withdraw = withdraw;
