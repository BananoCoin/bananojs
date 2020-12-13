'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const bananoUtil = require('./banano-util.js');

  const MAX_ACCOUNTS_PENDING = 10;

  const LOG_SWEEP = false;

  const receive = async (loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, accountPrefix) => {
  /* istanbul ignore if */
    if (loggingUtil === undefined) {
      throw Error('loggingUtil is required.');
    }
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is required.');
    }
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error('account is required.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is required.');
    }
    /* istanbul ignore if */
    if (representative === undefined) {
      throw Error('representative is required.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is required.');
    }
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('STARTED receive account', account);
    }
    const pending = await bananodeApi.getAccountsPending([account], MAX_ACCOUNTS_PENDING);
    const response = {};
    response.pendingCount = 0;
    response.pendingBlocks = [];
    response.receiveCount = 0;
    response.receiveBlocks = [];
    response.pendingMessage = '';
    response.receiveMessage = '';
    if ((pending !== undefined) && (pending.blocks !== undefined) && (pending.blocks[account] !== undefined)) {
      const pendingHashes = Object.keys(pending.blocks[account]);
      response.pendingMessage = `pending ${pendingHashes.length} blocks, of max ${MAX_ACCOUNTS_PENDING}.`;
      response.pendingCount = pendingHashes.length;
      response.pendingBlocks = pendingHashes;
      /* istanbul ignore if */
      if (LOG_SWEEP) {
        loggingUtil.log('INTERIM receive pendingHashes', pendingHashes);
      }
      if (pendingHashes.length > 0) {
        const sweepBlocks = await sweep(loggingUtil, bananodeApi, privateKey, representative, specificPendingBlockHash, accountPrefix);
        response.receiveMessage = `received ${sweepBlocks.length} blocks.`;
        response.receiveCount = sweepBlocks.length;
        response.receiveBlocks = sweepBlocks;
      }
    } else {
      response.pendingMessage = `pending unknown blocks, of max ${MAX_ACCOUNTS_PENDING}.`;
    }
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('SUCCESS receive account', account);
    }
    return response;
  };


  const sweep = async (loggingUtil, bananodeApi, privateKey, representative, specificPendingBlockHash, accountPrefix) => {
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('STARTED sweep');
    }
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, accountPrefix);
    const accountsPending = await bananodeApi.getAccountsPending([account], MAX_ACCOUNTS_PENDING);
    const history = await bananodeApi.getAccountHistory(account, 1);
    const historyHistory = history.history;

    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log(`INTERIM sweep accountsPending`, accountsPending);
    }

    const accountOpenAndReceiveBlocks = [];

    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log(`INTERIM sweep historyHistory.length`, historyHistory.length);
    }
    if (historyHistory.length == 0) {
      let isFirstPending = true;
      const pendingBlockHashs = Object.keys(accountsPending.blocks[account]);
      /* istanbul ignore if */
      if (LOG_SWEEP) {
        loggingUtil.log(`INTERIM sweep pendingBlockHashs`, pendingBlockHashs);
      }
      for (let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        if ((specificPendingBlockHash == undefined) || specificPendingBlockHash == pendingBlockHash) {
          const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
          if (isFirstPending) {
            const pending = pendingBlockHash;
            /* istanbul ignore if */
            if (LOG_SWEEP) {
              loggingUtil.log(`INTERIM STARTED sweep openBlockHash pending`, pending);
            }
            const openBlockHash = await bananoUtil.open(bananodeApi, privateKey, publicKey, account, pending, pendingValueRaw, accountPrefix);
            /* istanbul ignore if */
            if (LOG_SWEEP) {
              loggingUtil.log(`INTERIM SUCCESS sweep openBlockHash`, account, openBlockHash);
            }
            accountOpenAndReceiveBlocks.push(openBlockHash);
            isFirstPending = false;
          } else {
            const frontiers = await bananodeApi.getFrontiers(account, 1);
            const previous = frontiers.frontiers[account];
            const hash = pendingBlockHash;
            const valueRaw = pendingValueRaw;
            const receiveBlockHash = await bananoUtil.receive(bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw, accountPrefix);
            /* istanbul ignore if */
            if (LOG_SWEEP) {
              loggingUtil.log(`INTERIM sweep receiveBlockHash`, account, receiveBlockHash);
            }
            accountOpenAndReceiveBlocks.push(receiveBlockHash);
          }
        }
      }
    } else {
      const pendingBlockHashs = Object.keys(accountsPending.blocks[account]);
      for (let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        if ((specificPendingBlockHash == undefined) || specificPendingBlockHash == pendingBlockHash) {
          const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
          const frontiers = await bananodeApi.getFrontiers(account, 1);
          /* istanbul ignore if */
          if (LOG_SWEEP) {
            loggingUtil.log(`INTERIM sweep hasHistory frontiers`, frontiers);
          }
          const accountBalanceRaw = await bananodeApi.getAccountBalanceRaw(account, accountPrefix);

          const previous = frontiers.frontiers[account];
          const hash = pendingBlockHash;
          const valueRaw = (BigInt(pendingValueRaw) + BigInt(accountBalanceRaw)).toString();
          const receiveBlockHash = await bananoUtil.receive(bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw, accountPrefix);
          /* istanbul ignore if */
          if (LOG_SWEEP) {
            loggingUtil.log(`INTERIM sweep hasHistory receiveBlockHash`, account, receiveBlockHash);
          }
          accountOpenAndReceiveBlocks.push(receiveBlockHash);
        }
      }
      /* istanbul ignore if */
      if (LOG_SWEEP) {
        loggingUtil.log(`INTERIM sweep hasHistory`, account, historyHistory.length, accountsPending.blocks[account]);
      }
    }
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('SUCCESS sweep', accountOpenAndReceiveBlocks);
    }

    return accountOpenAndReceiveBlocks;
  };


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.receive = receive;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.depositUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
