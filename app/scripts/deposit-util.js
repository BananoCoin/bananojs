'use strict';

const bananoUtil = require('./banano-util.js');

const MAX_ACCOUNTS_PENDING = 10;

const LOG_SWEEP = false;

const receive = async (loggingUtil, bananodeApi, account, privateKey, representative) => {
  if (loggingUtil === undefined) {
    throw Error('loggingUtil is required.');
  }
  if (bananodeApi === undefined) {
    throw Error('bananodeApi is required.');
  }
  if (account === undefined) {
    throw Error('account is required.');
  }
  if (privateKey === undefined) {
    throw Error('privateKey is required.');
  }
  if (representative === undefined) {
    throw Error('representative is required.');
  }
  if (LOG_SWEEP) {
    loggingUtil.log('STARTED getPendingCountMessage account', account);
  }
  const pending = await bananodeApi.getAccountsPending([account], MAX_ACCOUNTS_PENDING);
  const response = {};
  response.pendingCount = 0;
  response.receiveCount = 0;
  response.pendingMessage = '';
  response.receiveMessage = '';
  if ((pending !== undefined) && (pending.blocks !== undefined) && (pending.blocks[account] !== undefined)) {
    const pendingHashes = Object.keys(pending.blocks[account]);
    response.pendingMessage = `pending ${pendingHashes.length} blocks, of max ${MAX_ACCOUNTS_PENDING}.`;
    response.pendingCount = pendingHashes.length;
    if (LOG_SWEEP) {
      loggingUtil.log('INTERIM getPendingCountMessage pendingHashes', pendingHashes);
    }
    if (pendingHashes.length > 0) {
      const sweepBlocks = await sweep(loggingUtil, bananodeApi, privateKey, representative);
      response.receiveMessage = `received ${sweepBlocks.length} blocks.`;
      response.receiveCount = sweepBlocks.length;
    }
  } else {
    response.pendingMessage = `pending (max ${MAX_ACCOUNTS_PENDING}): none found:${JSON.stringify(pending)}\n`;
  }
  if (LOG_SWEEP) {
    loggingUtil.log('SUCCESS getPendingCountMessage account', account);
  }
  return response;
};


const sweep = async (loggingUtil, bananodeApi, privateKey, representative) => {
  if (LOG_SWEEP) {
    loggingUtil.log('STARTED sweep');
  }
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const accountsPending = await bananodeApi.getAccountsPending([account], MAX_ACCOUNTS_PENDING);
  const history = await bananodeApi.getAccountHistory(account, 1);
  const history_history = history.history;


  if (LOG_SWEEP) {
    loggingUtil.log(`INTERIM sweep accountsPending`, accountsPending);
  }

  const accountOpenAndReceiveBlocks = [];

  if (LOG_SWEEP) {
    loggingUtil.log(`INTERIM sweep history_history.length`, history_history.length);
  }
  if (history_history.length == 0) {
    const pendingBlockHashs = Object.keys(accountsPending.blocks[account]);
    if (LOG_SWEEP) {
      loggingUtil.log(`INTERIM sweep pendingBlockHashs`, pendingBlockHashs);
    }
    for (let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++) {
      const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
      const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
      if (pendingBlockHashIx == 0) {
        const pending = pendingBlockHash;
        const openBlockHash = await bananoUtil.open(bananodeApi, privateKey, publicKey, account, pending, pendingValueRaw);
        if (LOG_SWEEP) {
          loggingUtil.log(`INTERIM sweep openBlockHash`, account, openBlockHash);
        }
        accountOpenAndReceiveBlocks.push(openBlockHash);
      } else {
        const frontiers = await bananodeApi.getFrontiers(account, 1);
        const previous = frontiers[account];
        const hash = pendingBlockHash;
        const valueRaw = pendingValueRaw;
        const receiveBlockHash = await bananoUtil.receive(bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw);
        if (LOG_SWEEP) {
          loggingUtil.log(`INTERIM sweep receiveBlockHash`, account, receiveBlockHash);
        }
        accountOpenAndReceiveBlocks.push(receiveBlockHash);
      }
    }
  } else {
    const pendingBlockHashs = Object.keys(accountsPending.blocks[account]);
    for (let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++) {
      const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
      const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
      const frontiers = await bananodeApi.getFrontiers(account, 1);
      if (LOG_SWEEP) {
        loggingUtil.log(`INTERIM sweep hasHistory frontiers`, frontiers);
      }
      const accountBalanceRaw = await bananodeApi.getAccountBalanceRaw(account);

      const previous = frontiers.frontiers[account];
      const hash = pendingBlockHash;
      const valueRaw = (BigInt(pendingValueRaw) + BigInt(accountBalanceRaw)).toString();
      const receiveBlockHash = await bananoUtil.receive(bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw);
      if (LOG_SWEEP) {
        loggingUtil.log(`INTERIM sweep hasHistory receiveBlockHash`, account, receiveBlockHash);
      }
      accountOpenAndReceiveBlocks.push(receiveBlockHash);
    }
    if (LOG_SWEEP) {
      loggingUtil.log(`INTERIM sweep hasHistory`, account, history_history.length, accountsPending.blocks[account]);
    }
  }
  if (LOG_SWEEP) {
    loggingUtil.log('SUCCESS sweep', accountOpenAndReceiveBlocks);
  }

  return accountOpenAndReceiveBlocks;
};

exports.receive = receive;
