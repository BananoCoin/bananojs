'use strict';

/** @namespace Main */
/** @namespace BananodeApi */

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

const sendAmountToAccountWithRepresentativeAndPrevious = async (seed, seedIx, destAccount, amountRaw, representative, previousHash) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, representative, previousHash);
  return hash;
};

const sendAmountToAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
  return await bananoUtil.send(bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback)
      .catch((error) => {
        // console.trace(error);
        throw Error(error);
      });
};

const changeRepresentativeForSeed = async (seed, seedIx, representative) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const response = await bananoUtil.change(bananodeApi, privateKey, representative);
  return response;
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
