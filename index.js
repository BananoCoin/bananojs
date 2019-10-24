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
 * @return {string} returns the hash returned by the send.
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
 * @return {string} returns the hash returned by the send.
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
 * @return {string} returns the hash returned by the change.
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
 * @param {string} specificPendingBlockHash a specific block hash to receive (optional).
 * @return {object} returns the response returned by the receive.
 */
const receiveDepositsForSeed = async (seed, seedIx, representative, specificPendingBlockHash) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash);
  return response;
};

/**
 * Get the balance, in raw, for an account.
 *
 * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @return {string} the account's balance, in raw.
 */
const getAccountBalanceRaw = async (account) => {
  return await bananodeApi.getAccountBalanceRaw(account);
};

/**
 * Get the history for an account.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_history}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @param {string} count the count to use (use -1 for all).
 * @param {string} head the head to start at (optional).
 * @param {string} raw if true, return raw history (optional).
 * @return {object} the account's history.
 */
const getAccountHistory = async (account, count, head, raw) => {
  return await bananodeApi.getAccountHistory(account, count, head, raw);
};


/**
 * Get the account with a given seed and index.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @return {string} the account.
 */
const getAccountFromSeed = (seed, seedIx) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  return account;
};

/**
 * Sets the URL to use for the node behind the Bananode Api
 * @memberof Main
 * @param {string} url the new url
 * @return {undefined} returns nothing.
 */
const setBananodeApiUrl = (url) => {
  bananodeApi.setUrl(url);
};

/**
 * Get the account info for an account.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_info}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @param {boolean} representativeFlag the representativeFlag to use (optional).
 * @return {object} the account's info.
 */
const getAccountInfo = async (account, representativeFlag) => {
  return await bananodeApi.getAccountInfo(account, representativeFlag);
};

/**
 * Get the network block count.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#block_count}
 * @memberof BananodeApi
 * @return {object} the block count.
 */
const getBlockCount = async () => {
  return await bananodeApi.getBlockCount();
};

/**
 * Open an account with a given seed.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} representative the representative.
 * @param {string} pendingBlockHash the pending block hash.
 * @param {string} pendingValueRaw the pending block hash.
 * @return {string} returns the hash returned by the open.
 */
const openAccountFromSeed = async (seed, seedIx, representative, pendingBlockHash, pendingValueRaw) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  return await bananoUtil.open(bananodeApi, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw);
};

/**
 * Get the hash for a given block.
 *
 * @memberof BananoUtil
 * @param {string} block the seed to use to find the account.
 * @return {string} the block's hash.
 */
const getBlockHash = (block) => {
  return bananoUtil.hash(block);
};


/**
 * Get the signature for a given block (gets the hash of the block, and signs the hash).
 *
 * @memberof BananoUtil
 * @param {string} privateKey the private key used to sign the block.
 * @param {string} block the block to sign.
 * @return {string} the block's signature.
 */
const getSignature = (privateKey, block) => {
  return bananoUtil.sign(privateKey, block);
};

/**
 * Converts a hex string to bytes in a Uint8Array.
 *
 * @memberof BananoUtil
 * @param {string} hex the hex string to use.
 * @return {Uint8Array} the bytes in a Uint8Array.
 */
const getBytesFromHex = (hex) => {
  return bananoUtil.hexToBytes(hex);
};

/**
 * gets work bytes using the CPU.
 *
 * @memberof BananoUtil
 * @param {string} hash the hash to use to calculate work bytes.
 * @param {Uint8Array} workBytes the Uint8Array(8) used to store temporary calculations.
 * @return {string} the work bytes as a hex string.
 */
const getWorkUsingCpu = (hash, workBytes) => {
  return bananoUtil.getHashCPUWorker(hash, workBytes);
};


/**
 * Converts a hex string to bytes in a Uint8Array.
 *
 * @memberof CamoUtil
 * @param {string} toPrivateKey the private key that receives the funds.
 * @param {string} fromPublicKey the public key that sent the funds.
 * @return {string_array} the received hashes in an array.
 */
const camoReceive = async (toPrivateKey, fromPublicKey) => {
  return await camoUtil.receive( bananodeApi, toPrivateKey, fromPublicKey );
};


/**
 * Get the network block count.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_pending}
 * @memberof BananodeApi
 * @param {string_array} accounts the array of pending accounts.
 * @param {string} count the max count to get.
 * @return {object} the account's pending blocks.
 */
const getAccountsPending = async (accounts, count) => {
  return await bananodeApi.getAccountsPending(accounts, count);
};

module.exports.getAccountsPending = getAccountsPending;
module.exports.getAccountFromSeed = getAccountFromSeed;
module.exports.getAccountInfo = getAccountInfo;
module.exports.getBlockCount = getBlockCount;

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
module.exports.sendAmountToAccount = sendAmountToAccount;
module.exports.sendAmountToAccountWithRepresentativeAndPrevious = sendAmountToAccountWithRepresentativeAndPrevious;
module.exports.changeRepresentativeForSeed = changeRepresentativeForSeed;
module.exports.getSignature = getSignature;
module.exports.getBytesFromHex = getBytesFromHex;
module.exports.getWorkUsingCpu = getWorkUsingCpu;
module.exports.getZeroedWorkBytes = bananoUtil.getZeroedWorkBytes;
module.exports.isWorkValid = bananoUtil.isWorkValid;
module.exports.getAccountValidationInfo = bananoUtil.getAccountValidationInfo;
module.exports.receiveDepositsForSeed = receiveDepositsForSeed;
module.exports.getRawStrFromBananoStr = bananoUtil.getRawStrFromBananoStr;
module.exports.getRawStrFromBanoshiStr = bananoUtil.getRawStrFromBanoshiStr;
module.exports.setBananodeApiUrl = setBananodeApiUrl;
module.exports.getCamoPublicKey = camoUtil.getCamoPublicKey;
module.exports.getSharedSecret = camoUtil.getSharedSecret;
module.exports.camoReceive = camoReceive;
