'use strict';

// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack

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
 * Recieve deposits for an account with a given seed.
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
 * Send a withdrawal from an account with a given seed.
 * @memberof WithdrawUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {object} returns the response returned by the withdraw.
 */
  const sendWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = withdrawUtil.withdraw(loggingUtil, bananodeApi, privateKey, toAccount, amountBananos);
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
 * receives funds at a camo address.
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
 * finds a new private key to recieve more funds. the key would have no history.
 *
 * @memberof CamoUtil
 * @param {string} seed the seed to use to find the account.
 * @return {string} the private key to use.
 */
  const camoGetNextPrivateKeyForReceive = async (seed) => {
    return await camoUtil.getFirstUnopenedPrivateKey( bananodeApi, seed );
  };

  /**
 * sends funds to a camo address.
 *
 * @memberof CamoUtil
 * @param {string} fundingPrivateKey the private key that sends the funds.
 * @param {string} fromCamoPrivateKey the private key used to generate the shared seed.
 * @param {string} toCamoPublicKey the public key that receives the funds.
 * @param {string} amountBananos the amount of bananos.
 * @return {string_array} the sent hashes in an array.
 */
  const camoSend = async (fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos) => {
    const amountRaw = bananoUtil.getRawStrFromBananoStr(amountBananos);
    return await camoUtil.send( bananodeApi, fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountRaw);
  };

  /**
 * sends funds to a camo account.
 * This function uses seed index 0 to generate the shared secret,
 * and seed index "seedIx" to get the private key that contains funds to send.
 *
 * @memberof CamoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {string_array} the sent hashes in an array.
 */
  const camoSendWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const accountValid = getCamoAccountValidationInfo(toAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const fundingPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromCamoPrivateKey = bananoUtil.getPrivateKey(seed, 0);
    const toCamoPublicKey = bananoUtil.getAccountPublicKey(toAccount);
    return await camoSend( fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos);
  };

  /**
 * get the pending blocks for the camo account.
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} fromAccount the account to recieve from.
 * @param {number} count the max count to get.
 * @return {string_array} the pending hashes in an array.
 */
  const camoGetAccountsPending = async (seed, seedIx, fromAccount, sharedSeedIx, count) => {
    const accountValid = getCamoAccountValidationInfo(fromAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const toPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromPublicKey = bananoUtil.getAccountPublicKey(fromAccount);
    return await camoUtil.getAccountsPending(bananodeApi, toPrivateKey, fromPublicKey, sharedSeedIx, count);
  };

  /**
 * returns data on whether a camo account is valid or not, and why.
 * @param {string} account the account to check.
 * @return {object} the account validity data.
 */
  const getCamoAccountValidationInfo = (account) => {
    const accountValid = camoUtil.isCamoAccountValid(account);
    return accountValid;
  };

  /**
 * get the shared account, used as an intermediary to send finds between the seed and the camo account.
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} account the camo account to send or recieve from.
 * @param {string} sharedSeedIx the index to use with the shared seed.
 * @return {string} the shared account.
 */
  const getCamoSharedAccountData = async (seed, seedIx, account, sharedSeedIx) => {
    const accountValid = getCamoAccountValidationInfo(account);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    return await camoUtil.getSharedAccountData(bananodeApi, privateKey, publicKey, sharedSeedIx);
  };


  /**
* Recieve deposits for a camo account with a given seed.
 * @memberof CamoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} account the camo account to send or recieve from.
 * @param {string} sharedSeedIx the index to use with the shared seed.
 * @param {string} pendingBlockHash the pending block to recieve.
 * @return {string} the response from receiving the block.
 */
  const receiveCamoDepositsForSeed = async (seed, seedIx, account, sharedSeedIx, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    const sharedSecret = await camoUtil.getSharedSecretFromRepresentative( bananodeApi, privateKey, publicKey );
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const privateKey = bananoUtil.getPrivateKey(sharedSeed, sharedSeedIx);
      const camoPublicKey = await camoUtil.getCamoPublicKey(privateKey);
      const camoRepresentative = await camoUtil.getCamoAccount(camoPublicKey);
      const repPublicKey = await bananoUtil.getAccountPublicKey(camoRepresentative);
      const representative = await bananoUtil.getAccount(repPublicKey);
      const response = await receiveDepositsForSeed(sharedSeed, sharedSeedIx, representative, specificPendingBlockHash);
      return response;
    } else {
      return undefined;
    }
  };

  /**
 * gets the total account balance, in raw.
 *
 * @memberof CamoUtil
 * @param {string} toPrivateKey the private key that receives the funds.
 * @param {string} fromPublicKey the public key that sent the funds.
 * @return {string} the account balance, in raw.
 */
  const getCamoAccountBalanceRaw = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.getBalanceRaw( bananodeApi, toPrivateKey, fromPublicKey);
  };

  /**
 * Get the network block count.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_pending}
 * @memberof BananodeApi
 * @param {string_array} accounts the array of pending accounts.
 * @param {number} count the max count to get.
 * @param {string} source if true, get source.
 * @return {object} the account's pending blocks.
 */
  const getAccountsPending = async (accounts, count, source) => {
    return await bananodeApi.getAccountsPending(accounts, count, source);
  };

  // STARTED BOTTOM nodejs/browser hack
  const bananocoinBananojs = (() => {
    const BananocoinBananojs = {};

    BananocoinBananojs.sendWithdrawalFromSeed = sendWithdrawalFromSeed;
    BananocoinBananojs.getAccountsPending = getAccountsPending;
    BananocoinBananojs.getAccountFromSeed = getAccountFromSeed;
    BananocoinBananojs.getAccountInfo = getAccountInfo;
    BananocoinBananojs.getBlockCount = getBlockCount;

    BananocoinBananojs.bananoUtil = bananoUtil;
    BananocoinBananojs.bananodeApi = bananodeApi;
    BananocoinBananojs.camoUtil = camoUtil;
    BananocoinBananojs.depositUtil = depositUtil;
    BananocoinBananojs.withdrawUtil = withdrawUtil;
    BananocoinBananojs.loggingUtil = loggingUtil;

    BananocoinBananojs.setBananodeApi = setBananodeApi;
    BananocoinBananojs.getAccountHistory = getAccountHistory;
    BananocoinBananojs.openAccountFromSeed = openAccountFromSeed;
    BananocoinBananojs.getBlockHash = getBlockHash;
    BananocoinBananojs.getAccountBalanceRaw = getAccountBalanceRaw;
    BananocoinBananojs.getBananoPartsFromRaw = bananoUtil.getBananoPartsFromRaw;
    BananocoinBananojs.getPrivateKey = bananoUtil.getPrivateKey;
    BananocoinBananojs.getPublicKey = bananoUtil.getPublicKey;
    BananocoinBananojs.getAccount = bananoUtil.getAccount;
    BananocoinBananojs.getAccountPublicKey = bananoUtil.getAccountPublicKey;
    BananocoinBananojs.sendAmountToAccount = sendAmountToAccount;
    BananocoinBananojs.sendAmountToAccountWithRepresentativeAndPrevious = sendAmountToAccountWithRepresentativeAndPrevious;
    BananocoinBananojs.changeRepresentativeForSeed = changeRepresentativeForSeed;
    BananocoinBananojs.getSignature = getSignature;
    BananocoinBananojs.getBytesFromHex = getBytesFromHex;
    BananocoinBananojs.getWorkUsingCpu = getWorkUsingCpu;
    BananocoinBananojs.getZeroedWorkBytes = bananoUtil.getZeroedWorkBytes;
    BananocoinBananojs.isWorkValid = bananoUtil.isWorkValid;
    BananocoinBananojs.getAccountValidationInfo = bananoUtil.getAccountValidationInfo;
    BananocoinBananojs.receiveDepositsForSeed = receiveDepositsForSeed;
    BananocoinBananojs.getRawStrFromBananoStr = bananoUtil.getRawStrFromBananoStr;
    BananocoinBananojs.getRawStrFromBanoshiStr = bananoUtil.getRawStrFromBanoshiStr;
    BananocoinBananojs.setBananodeApiUrl = setBananodeApiUrl;
    BananocoinBananojs.getCamoPublicKey = camoUtil.getCamoPublicKey;
    BananocoinBananojs.getSharedSecret = camoUtil.getSharedSecret;
    BananocoinBananojs.camoReceive = camoReceive;
    BananocoinBananojs.camoSend = camoSend;
    BananocoinBananojs.camoSendWithdrawalFromSeed = camoSendWithdrawalFromSeed;
    BananocoinBananojs.getCamoAccount = camoUtil.getCamoAccount;
    BananocoinBananojs.getCamoAccountBalanceRaw = getCamoAccountBalanceRaw;
    BananocoinBananojs.camoGetNextPrivateKeyForReceive = camoGetNextPrivateKeyForReceive;
    BananocoinBananojs.camoGetAccountsPending = camoGetAccountsPending;
    BananocoinBananojs.getCamoSharedAccountData = getCamoSharedAccountData;
    BananocoinBananojs.receiveCamoDepositsForSeed = receiveCamoDepositsForSeed;
    BananocoinBananojs.getCamoAccountValidationInfo = getCamoAccountValidationInfo;

    return BananocoinBananojs;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = bananocoinBananojs;
  } else {
    window.bananocoinBananojs = bananocoinBananojs;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
