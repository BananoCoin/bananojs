const ಠ_ಠUtil = require('./app/scripts/ಠ_ಠ-util.js');
const realBananodeApi = require('./app/scripts/ಠ_ಠde-api.js');
const camoUtil = require('./app/scripts/camo-util.js');
const depositUtil = require('./app/scripts/deposit-util.js');
const withdrawUtil = require('./app/scripts/withdraw-util.js');
const loggingUtil = require('./app/scripts/logging-util.js');

let ಠ_ಠdeApi = realBananodeApi;

const setBananodeApi = (_ಠ_ಠdeApi) => {
  ಠ_ಠdeApi = _ಠ_ಠdeApi;
};

const sendAmountToAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
  await ಠ_ಠUtil.send(ಠ_ಠdeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback);
};

const changeRepresentativeForSeed = async (seed, seedIx, representative) => {
  const privateKey = ಠ_ಠUtil.getPrivateKey(seed, seedIx);
  const response = await ಠ_ಠUtil.change(ಠ_ಠdeApi, privateKey, representative);
  return response;
};

const receiveDepositsForSeed = async (seed, seedIx, representative) => {
  const privateKey = ಠ_ಠUtil.getPrivateKey(seed, seedIx);
  const publicKey = ಠ_ಠUtil.getPublicKey(privateKey);
  const account = ಠ_ಠUtil.getAccount(publicKey);
  const response = await depositUtil.receive(loggingUtil, ಠ_ಠdeApi, account, privateKey, representative);
  return response;
};

const getAccountBalanceRaw = async (account) => {
  return await ಠ_ಠdeApi.getAccountBalanceRaw(account);
};

const getAccountHistory = async (account, count, head, raw) => {
  return await ಠ_ಠdeApi.getAccountHistory(account, count, head, raw);
};

const getAccountFromSeed = (seed, seedIx) => {
  const privateKey = ಠ_ಠUtil.getPrivateKey(seed, seedIx);
  const publicKey = ಠ_ಠUtil.getPublicKey(privateKey);
  const account = ಠ_ಠUtil.getAccount(publicKey);
  return account;
};

const setBananodeApiUrl = (url) => {
  ಠ_ಠdeApi.setUrl(url);
};

const getAccountInfo = async (account) => {
  return await ಠ_ಠdeApi.getAccountInfo(account);
};

module.exports.getAccountFromSeed = getAccountFromSeed;
module.exports.getAccountInfo = getAccountInfo;
module.exports.ಠ_ಠUtil = ಠ_ಠUtil;
module.exports.ಠ_ಠdeApi = ಠ_ಠdeApi;
module.exports.camoUtil = camoUtil;
module.exports.depositUtil = depositUtil;
module.exports.withdrawUtil = withdrawUtil;
module.exports.loggingUtil = loggingUtil;

module.exports.setBananodeApi = setBananodeApi;
module.exports.getAccountHistory = getAccountHistory;
module.exports.getAccountBalanceRaw = getAccountBalanceRaw;
module.exports.getBananoPartsFromRaw = ಠ_ಠUtil.getBananoPartsFromRaw;
module.exports.getPrivateKey = ಠ_ಠUtil.getPrivateKey;
module.exports.getPublicKey = ಠ_ಠUtil.getPublicKey;
module.exports.getAccount = ಠ_ಠUtil.getAccount;
module.exports.getAccountPublicKey = ಠ_ಠUtil.getAccountPublicKey;
module.exports.getHash = ಠ_ಠUtil.hash;
module.exports.sendAmountToAccount = sendAmountToAccount;
module.exports.changeRepresentativeForSeed = changeRepresentativeForSeed;
module.exports.getSignature = ಠ_ಠUtil.sign;
module.exports.getBytesFromHex = ಠ_ಠUtil.hexToBytes;
module.exports.getWorkUsingCpu = ಠ_ಠUtil.getHashCPUWorker;
module.exports.isWorkValid = ಠ_ಠUtil.isWorkValid;
module.exports.getAccountValidationInfo = ಠ_ಠUtil.getAccountValidationInfo;
module.exports.receiveDepositsForSeed = receiveDepositsForSeed;
module.exports.getRawStrFromBanoshiStr = ಠ_ಠUtil.getRawStrFromBanoshiStr;
module.exports.setBananodeApiUrl = setBananodeApiUrl;
