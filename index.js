'use strict';

const bananoUtil = require('./app/scripts/banano-util.js');
const realBananodeApi = require('./app/scripts/bananode-api.js');
const camoUtil = require('./app/scripts/camo-util.js');
const depositUtil = require('./app/scripts/deposit-util.js');
const withdrawUtil = require('./app/scripts/withdraw-util.js');
const loggingUtil = require('./app/scripts/logging-util.js');

let bananodeApi = realBananodeApi;

/**
 * Sets the Bananode Api (useful for overriding some methods)
 * @memberof Main
 * @param {string} _bananodeApi the new bananodeApi
 * @return {undefined} returns nothing.
 */
const setBananodeApi = (_bananodeApi) => {
  bananodeApi = _bananodeApi;
};

/**
 * Sends the amount to the account with an optional representative and
 * previous block hash.
 * If the representative is not sent, it will be pulled from the api.
 * If the previous is not sent, it will be pulled from the api.
 * Be very careful with previous, as setting it incorrectly
 * can cause an incorrect amount of funds to be sent.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} destAccount the destination account.
 * @param {string} amountRaw the amount to send, in raw.
 * @param {string} representative the representative (optional).
 * @param {string} previousHash the previous hash (optional).
 * @return {hash} returns the hash returned by the send.
 */
const sendAmountToAccountWithRepresentativeAndPrevious = async (seed, seedIx, destAccount, amountRaw, representative, previousHash) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, representative, previousHash);
  return hash;
};

/**
 * Sends the amount to the account with a callback for success and failure.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} destAccount the destination account.
 * @param {string} amountRaw the amount to send, in raw.
 * @param {string} successCallback the callback to call upon success.
 * @param {string} failureCallback the callback to call upon failure.
 * @return {hash} returns the hash returned by the send.
 */
const sendAmountToAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
  return await bananoUtil.send(bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback)
      .catch((error) => {
        // console.trace(error);
        throw Error(error);
      });
};

/**
 * Sets the rep for an account with a given seed.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} representative the representative.
 * @return {hash} returns the hash returned by the change.
 */
const changeRepresentativeForSeed = async (seed, seedIx, representative) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const response = await bananoUtil.change(bananodeApi, privateKey, representative);
  return response;
};


/**
 * Recieve all deposits for an account with a given seed.
 * @memberof DepositUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} representative the representative.
 * @return {hash} returns the hash returned by the change.
 */
const receiveDepositsForSeed = async (seed, seedIx, representative) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative);
  return response;
};

/**
 * Get the balance, in raw, for an account.
 * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @return {balance}, account's balance, in raw.
 */
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

const openAccountFromSeed = async (seed, seedIx, representative, pendingBlockHash, pendingValueRaw) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  return await bananoUtil.open(bananodeApi, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw);
};

const getBlockHash = (block) => {
  return bananoUtil.hash(block);
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
module.exports.openAccountFromSeed = openAccountFromSeed;
module.exports.getBlockHash = getBlockHash;
module.exports.getAccountBalanceRaw = getAccountBalanceRaw;
module.exports.getBananoPartsFromRaw = bananoUtil.getBananoPartsFromRaw;
module.exports.getPrivateKey = bananoUtil.getPrivateKey;
module.exports.getPublicKey = bananoUtil.getPublicKey;
module.exports.getAccount = bananoUtil.getAccount;
module.exports.getAccountPublicKey = bananoUtil.getAccountPublicKey;
module.exports.getHash = bananoUtil.hash;
module.exports.sendAmountToAccount = sendAmountToAccount;
module.exports.sendAmountToAccountWithRepresentativeAndPrevious = sendAmountToAccountWithRepresentativeAndPrevious;
module.exports.changeRepresentativeForSeed = changeRepresentativeForSeed;
module.exports.getSignature = bananoUtil.sign;
module.exports.getBytesFromHex = bananoUtil.hexToBytes;
module.exports.getWorkUsingCpu = bananoUtil.getHashCPUWorker;
module.exports.getZeroedWorkBytes = bananoUtil.getZeroedWorkBytes;
module.exports.isWorkValid = bananoUtil.isWorkValid;
module.exports.getAccountValidationInfo = bananoUtil.getAccountValidationInfo;
module.exports.receiveDepositsForSeed = receiveDepositsForSeed;
module.exports.getRawStrFromBananoStr = bananoUtil.getRawStrFromBananoStr;
module.exports.getRawStrFromBanoshiStr = bananoUtil.getRawStrFromBanoshiStr;
module.exports.setBananodeApiUrl = setBananodeApiUrl;
module.exports.getCamoPublicKey = camoUtil.getCamoPublicKey;
module.exports.getSharedSecret = camoUtil.getSharedSecret;
