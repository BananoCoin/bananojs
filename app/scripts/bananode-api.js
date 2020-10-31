'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const https = require('https');

  let url;

  const LOG_GET_GENERATED_WORK = false;

  const sendRequest = async (formData) => {
    if (formData == undefined) {
      throw Error(`'formData' is a required parameter.`);
    }
    return new Promise((resolve) => {
    // https://docs.nano.org/commands/rpc-protocol#accounts-balances

      const apiUrl = new URL(url);
      const body = JSON.stringify(formData);
      //        console.log( 'sendRequest request', body );

      const options = {
        method: 'POST',
        hostname: apiUrl.hostname,
        path: apiUrl.pathname,
        port: 443,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
        },
        timeout: 30000,
      };

      const req = https.request(options, (res) => {
      // console.log(`statusCode: ${res.statusCode}`);
        let chunks = '';
        res.on('data', (chunk) => {
          chunks += chunk;
        });

        res.on('end', () => {
          if (chunks.length == 0) {
            resolve(undefined);
          } else {
            const json = JSON.parse(chunks);
            resolve(json);
          }
        });
      });

      req.on('error', (error) => {
        throw Error(error);
        console.log('sendRequest error', error, body);
      });

      req.write(body);
      req.end();
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

  const getAccountInfo = async (account, representativeFlag) => {
    if (account === undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    // https://docs.nano.org/commands/rpc-protocol/#account_info
    const formData = {
      action: 'account_info',
      account: account,
    };

    if (representativeFlag !== undefined) {
      if (representativeFlag) {
        formData.representative = 'true';
      } else {
        formData.representative = 'false';
      }
    }

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

  const process = async (block, subtype) => {
    if (block == undefined) {
      throw Error(`'block' is a required parameter.'`);
    }
    if (subtype == undefined) {
      throw Error(`'subtype' is a required parameter.'`);
    }

    // https://docs.nano.org/commands/rpc-protocol/#process
    const formData = {
      'action': 'process',
      'json_block': 'true',
      'subtype': subtype,
      'block': block,
    };
    if (block.work === undefined) {
      formData.do_work = true;
    }
    //    console.log( `process request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData).then((json) => {
      //            console.log( `process response ${JSON.stringify( json )}` );
        if (json === undefined) {
          resolve('');
        } else {
          if (json.hash === undefined) {
            if (json.error === undefined) {
              const jsonStr = JSON.stringify( json );
              console.log(`process reject ${jsonStr}`);
              reject(Error(jsonStr));
            } else {
              reject(Error(json.error));
            }
          } else {
            const hash = json.hash;
            resolve(hash);
          }
        }
      });
    });
  };

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

  const getAccountsPending = async (accounts, count, source) => {
    if (accounts === undefined) {
      throw Error('accounts is a required parameter.');
    }
    if (count === undefined) {
      throw Error('count is a required parameter.');
    }
    // https://docs.nano.org/commands/rpc-protocol/#accounts_pending
    const formData = {
      action: 'accounts_pending',
      accounts: accounts,
      count: count,
      threshold: 1,
    };

    if (source !== undefined) {
      if (source) {
        formData.source = 'true';
      } else {
        formData.source = 'false';
      }
    }
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
    //    console.log( `block_account request ${JSON.stringify( formData )}` );
    return new Promise((resolve) => {
      sendRequest(formData).then((json) => {
      //            console.log( `block_account response ${JSON.stringify( json )}` );
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
    //    console.log( `frontiers request ${JSON.stringify( formData )}` );
    return new Promise((resolve) => {
      sendRequest(formData).then((json) => {
      //            console.log( `frontiers response ${JSON.stringify( json )}` );
        resolve(json);
      });
    });
  };

  const getBlockCount = async () => {
  // https://docs.nano.org/commands/rpc-protocol/#block_count
    const formData = {
      action: 'block_count',
    };
    //    console.log( `block_count request ${JSON.stringify( formData )}` );
    return new Promise((resolve) => {
      sendRequest(formData).then((json) => {
      //            console.log( `block_count response ${JSON.stringify( json )}` );
        resolve(json);
      });
    });
  };

  const setUrl = (newUrl) => {
    url = newUrl;
  };


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

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
    exports.getBlockCount = getBlockCount;
    exports.log = console.log;
    exports.trace = console.trace;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.bananodeApi = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
