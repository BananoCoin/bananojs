const request = require('request');

let url;

const LOG_GET_GENERATED_WORK = false;

const sendRequest = async (formData) => {
  if (formData == undefined) {
    throw Error(`'formData' is a required parameter.`);
  }
  return new Promise((resolve) => {
    // https://docs.nano.org/commands/rpc-protocol#accounts-balances

    const body = JSON.stringify(formData);
    //        console.log( 'sendRequest request', body );

    request({
      headers: {
        'Content-Type': 'application/json',
      },
      uri: url,
      body: body,
      method: 'POST',
      timeout: 30000,
    }, (err, httpResponse, body) => {
      //            console.log( 'sendRequest response', err, body );

      if (err !== null) {
        console.log('sendRequest response', err, body);
      }

      if (body === undefined) {
        resolve(undefined);
      } else {
        const json = JSON.parse(body);
        resolve(json);
      }
    });
  });
};

const getAccountBalanceRaw = async (account) => {
  if (account == undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  const formData = {
    action: 'accounts_balances',
    accounts: [account],
  };
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      if (json == undefined) {
        resolve();
        return;
      }
      //            console.log( 'getAccountBalanceRaw json', json );
      //            console.log( 'getAccountBalanceRaw json.balances', json.balances );

      const balance = json.balances[account].balance;
      //            console.log( 'getAccountBalanceRaw balance', balance );
      resolve(balance);
    });
  });
};

const getAccountRepresentative = async (account) => {
  if (account == undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  // https://docs.nano.org/commands/rpc-protocol#account-representative
  const formData = {
    action: 'account_representative',
    account: account,
  };
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      if (json === undefined) {
        resolve('');
      } else {
        const representative = json.representative;
        resolve(representative);
      }
    });
  });
};

const getPrevious = async (account) => {
  if (account == undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  // https://docs.nano.org/commands/rpc-protocol#frontiers
  const formData = {
    action: 'accounts_frontiers',
    accounts: [account],
    count: 1,
  };
  //    console.log( `getPrevious request ${account}` );
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      //            console.log( `getPrevious response ${JSON.stringify( json )}` );
      if (json === undefined) {
        resolve('');
      } else if (json.frontiers == '') {
        //                console.log( `getPrevious response ${account}` );
        resolve('');
      } else {
        const previous = json.frontiers[account];
        //                console.log( `getPrevious response ${account} ${previous}` );
        resolve(previous);
      }
    });
  });
};


const getAccountHistory = async (account, count, head, raw) => {
  if (account === undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  if (count === undefined) {
    throw Error(`'count' is a required parameter.`);
  }
  // https://docs.nano.org/commands/rpc-protocol/#account_history
  const formData = {
    action: 'account_history',
    account: account,
    count: count,
  };

  if (head !== undefined) {
    formData.head = head;
  }

  if (raw !== undefined) {
    formData.raw = raw;
  }

  //    console.log( `account_history request ${JSON.stringify( formData )}` );
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      // console.log( `account_history response ${JSON.stringify( json )}` );
      resolve(json);
    });
  });
};

const getAccountInfo = async (account) => {
  if (account === undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  // https://docs.nano.org/commands/rpc-protocol/#account_info
  const formData = {
    action: 'account_info',
    account: account,
  };

  //    console.log( `account_history request ${JSON.stringify( formData )}` );
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      // console.log( `account_history response ${JSON.stringify( json )}` );
      resolve(json);
    });
  });
};

const getBlocks = async (hashes, source) => {
  if (hashes === undefined) {
    throw Error(`'hashes' is a required parameter.`);
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#retrieve-multiple-blocks
  const formData = {
    action: 'blocks',
    hashes: hashes,
  };

  if (source !== undefined) {
    formData.source = source;
  }

  //    console.log( `account_history request ${JSON.stringify( formData )}` );
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      // console.log( `account_history response ${JSON.stringify( json )}` );
      resolve(json);
    });
  });
};

const process = async (block) => {
  if (block == undefined) {
    throw Error(`'block' is a required parameter.'`);
  }
  // https://docs.nano.org/commands/rpc-protocol#process-block
  const formData = {
    action: 'process',
    block: JSON.stringify(block),
  };
  //    console.log( `process request ${JSON.stringify( formData )}` );
  return new Promise((resolve, reject) => {
    sendRequest(formData).then((json) => {
      //            console.log( `process response ${JSON.stringify( json )}` );
      if (json === undefined) {
        resolve('');
      } else {
        if (json.hash === undefined) {
          console.log(`process reject ${JSON.stringify( json )}`);
          reject(json);
        } else {
          const hash = json.hash;
          resolve(hash);
        }
      }
    });
  });
};


/**
 * note: enable_control required.
 */
const getGeneratedWork = async (hash) => {
  // https://docs.nano.org/commands/rpc-protocol#work-generate
  const formData = {
    action: 'work_generate',
    hash: hash,
  };

  if (LOG_GET_GENERATED_WORK) {
    console.log(`STARTED getGeneratedWork request ${JSON.stringify( formData )}`);
  }

  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      if (json === undefined) {
        resolve('');
      } else {
        if (LOG_GET_GENERATED_WORK) {
          console.log(`SUCCESS getGeneratedWork response ${JSON.stringify( json )}`);
        }
        const work = json.work;
        resolve(work);
      }
    });
  });
};

const getAccountsPending = async (accounts, count) => {
  if (accounts === undefined) {
    throw Error('accounts is a required parameter.');
  }
  if (count === undefined) {
    throw Error('count is a required parameter.');
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#accounts-pending
  const formData = {
    action: 'accounts_pending',
    accounts: accounts,
    count: count,
    threshold: 1,
  };
  //    console.log( `accounts_pending request ${JSON.stringify( formData )}` );
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      //            console.log( `accounts_pending response ${JSON.stringify( json )}` );
      resolve(json);
    });
  });
};

const getBlockAccount = async (hash) => {
  if (hash === undefined) {
    throw Error('hash is a required parameter.');
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#block-account
  const formData = {
    action: 'block_account',
    hash: hash,
  };
  //    console.log( `accounts_pending request ${JSON.stringify( formData )}` );
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      //            console.log( `accounts_pending response ${JSON.stringify( json )}` );
      resolve(json);
    });
  });
};

const getFrontiers = async (account, count) => {
  if (account === undefined) {
    throw Error('account is a required parameter.');
  }
  if (count === undefined) {
    throw Error('count is a required parameter.');
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#frontiers
  const formData = {
    action: 'frontiers',
    account: account,
    count: count,
  };
  //    console.log( `accounts_pending request ${JSON.stringify( formData )}` );
  return new Promise((resolve) => {
    sendRequest(formData).then((json) => {
      //            console.log( `accounts_pending response ${JSON.stringify( json )}` );
      resolve(json);
    });
  });
};

const setUrl = (newUrl) => {
  url = newUrl;
};

exports.setUrl = setUrl;
exports.getFrontiers = getFrontiers;
exports.getBlockAccount = getBlockAccount;
exports.getAccountsPending = getAccountsPending;
exports.getAccountBalanceRaw = getAccountBalanceRaw;
exports.getAccountRepresentative = getAccountRepresentative;
exports.getPrevious = getPrevious;
exports.process = process;
exports.getGeneratedWork = getGeneratedWork;
exports.getAccountHistory = getAccountHistory;
exports.getAccountInfo = getAccountInfo;
exports.getBlocks = getBlocks;
exports.log = console.log;
exports.trace = console.trace;
