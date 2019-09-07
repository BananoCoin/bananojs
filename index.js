const bananoUtil = require('./app/scripts/banano-util.js');
const realBananodeApi = require('./app/scripts/bananode-api.js');
const camoUtil = require('./app/scripts/camo-util.js');
const depositUtil = require('./app/scripts/deposit-util.js');
const withdrawUtil = require('./app/scripts/withdraw-util.js');
const loggingUtil = require('./app/scripts/logging-util.js');

let bananodeApi = realBananodeApi;

const setBananodeApi = (_bananodeApi) => {
  bananodeApi = _bananodeApi;
};

const sendAmountToAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
  await bananoUtil.send(bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback);
};

const receiveDepositsForSeed = async (seed, seedIx, representative) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative);
  return response;
};

const getAccountBalanceRaw = async (account) => {
  return await bananodeApi.getAccountBalanceRaw(account);
};

const getAccountHistory = async (account, count, head, raw) => {
  return await bananodeApi.getAccountHistory(account, count, head, raw);
};

const getAccountFromSeed = (seed, seedIx) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  return account;
};

const setBananodeApiUrl = (url) => {
  bananodeApi.setUrl(url);
};

const getAccountInfo = async (account) => {
  return await bananodeApi.getAccountInfo(account);
};

module.exports.getAccountFromSeed = getAccountFromSeed;
module.exports.getAccountInfo = getAccountInfo;
module.exports.bananoUtil = bananoUtil;
module.exports.bananodeApi = bananodeApi;
module.exports.camoUtil = camoUtil;
module.exports.depositUtil = depositUtil;
module.exports.withdrawUtil = withdrawUtil;
module.exports.loggingUtil = loggingUtil;

module.exports.setBananodeApi = setBananodeApi;
module.exports.getAccountHistory = getAccountHistory;
module.exports.getAccountBalanceRaw = getAccountBalanceRaw;
module.exports.getBananoPartsFromRaw = bananoUtil.getBananoPartsFromRaw;
module.exports.getPrivateKey = bananoUtil.getPrivateKey;
module.exports.getPublicKey = bananoUtil.getPublicKey;
module.exports.getAccount = bananoUtil.getAccount;
module.exports.getAccountPublicKey = bananoUtil.getAccountPublicKey;
module.exports.getHash = bananoUtil.hash;
module.exports.sendAmountToAccount = sendAmountToAccount;
module.exports.getSignature = bananoUtil.sign;
module.exports.getBytesFromHex = bananoUtil.hexToBytes;
module.exports.getWorkUsingCpu = bananoUtil.getHashCPUWorker;
module.exports.isWorkValid = bananoUtil.isWorkValid;
module.exports.getAccountValidationInfo = bananoUtil.getAccountValidationInfo;
module.exports.receiveDepositsForSeed = receiveDepositsForSeed;
module.exports.getRawStrFromBanoshiStr = bananoUtil.getRawStrFromBanoshiStr;
module.exports.setBananodeApiUrl = setBananodeApiUrl;
