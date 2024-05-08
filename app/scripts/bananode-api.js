'use strict';

// STARTED TOP nodejs/browser hack
(function() {
  // FINISHED TOP nodejs/browser hack
  const https = require('https');
  const http = require('http');
  let moduleRef;

  let url;

  let logRequestErrors = true;

  let useRateLimit = false;

  const LOG_GET_GENERATED_WORK = false;

  let auth;

  let arbitraryHeaders;

  /**
   * Sets an authorization string (http 'Authorization' header), useful if node requires api key.
   *
   * @memberof BananodeApi
   * @param {string} authString api key as a string
   * @return {undefined} returns nothing.
   */
  const setAuth = (authString) => {
    auth = authString;
  };

  /**
   * Sets arbitrary headers
   *
   * @memberof BananodeApi
   * @param {Object.<string, string>} arbitraryHeaders key-value pair object of header names (key) to header values (value), trying to specify Content-Type and Content-Length headers will not work
   * @return {undefined} returns nothing.
   */
  const setHeaders = (arbitraryHeaders) => {
    arbitraryHeaders = arbitraryHeaders;
  };

  const delay = (time) => {
    // console.log('delay', 'time', time);
    if (!isNaN(time)) {
      if (isFinite(time)) {
        return new Promise((resolve) => {
          const fn = () => {
            resolve();
          };
          setTimeout(fn, time);
        });
      }
    }
  };

  const sendRequest = async (formData) => {
    /* istanbul ignore if */
    if (formData == undefined) {
      throw Error(`'formData' is a required parameter.`);
    }
    return new Promise((resolve, reject) => {
      // https://docs.nano.org/commands/rpc-protocol#accounts-balances

      const apiUrl = new URL(url);
      // console.log('apiUrl', apiUrl);
      const body = JSON.stringify(formData);
      //        console.log( 'sendRequest request', body );

      const options = {
        method: 'POST',
        hostname: apiUrl.hostname,
        path: apiUrl.pathname,
        port: apiUrl.port,
        headers: {
          ...arbitraryHeaders,
          'Content-Type': 'application/json',
          'Content-Length': body.length,
        },
        timeout: 30000,
      };

      if (!!auth) {
        options.headers['Authorization'] = auth;
      }

      // console.log('url', url);
      // console.log('apiUrl.protocol', apiUrl.protocol);
      const req = moduleRef.request(options, (res) => {
        // console.log('res.statusCode', res.statusCode);
        if (res.statusCode < 200 || res.statusCode > 299) {
          // console.trace('error', res.statusCode);
          let chunks = '';
          res.on('data', (chunk) => {
            chunks += chunk;
          });

          res.on('end', () => {
            // console.trace('error', res.statusCode);
            reject(Error(JSON.stringify({body: chunks, statusCode: res.statusCode})));
          });
        } else {
          // console.log(`statusCode: ${res.statusCode}`);
          let chunks = '';
          res.on('data', (chunk) => {
            chunks += chunk;
          });

          res.on('end', async () => {
            // console.log('headers', 'useRateLimit', useRateLimit);
            if (useRateLimit) {
              if (res.headers !== undefined) {
                const lastRemaining = parseInt(res.headers['x-ratelimit-remaining'], 10);
                // console.log('headers', 'lastRemaining', lastRemaining);
                const lastReset = parseInt(res.headers['x-ratelimit-reset'], 10);
                // console.log('headers', 'reset', lastReset);
                const time = Math.floor(Date.now() / 1000);
                // console.log('headers', 'timer', time);
                const timeRemaining = lastReset-time;
                // console.log('headers', 'timeRemaining', timeRemaining);
                const pauseTime = Math.floor((timeRemaining*1000.0)/(lastRemaining+1));
                // console.log('headers', 'pauseTime', pauseTime);
                // console.log('headers', 'delay', 'start');
                await delay(pauseTime);
              }
            }
            if (chunks.length == 0) {
              resolve(undefined);
            } else {
              try {
                const json = JSON.parse(chunks);
                resolve(json);
              } catch (error) {
                reject(error);
              }
            }
          });
        }
      });

      req.on('error', (error) => {
        /* istanbul ignore if */
        if (logRequestErrors) {
          console.log('sendRequest error', error, body);
        }
        reject(Error(error));
      });

      req.write(body);
      req.end();
    });
  };

  const getAccountBalanceRaw = async (account) => {
    const balances = await getAccountBalanceAndPendingRaw(account);
    if (balances) {
      return balances.balance;
    }
  };

  const getAccountBalanceAndPendingRaw = async (account) => {
    /* istanbul ignore if */
    if (account == undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    const formData = {
      action: 'accounts_balances',
      accounts: [account],
    };
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `accounts_balances error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            if (json == undefined) {
              resolve();
              return;
            }
            // console.log( 'accounts_balances json', json );
            if (json.balances == undefined) {
              resolve();
              return;
            }
            // console.log( 'accounts_balances json.balances', json.balances );
            resolve({
              balance: json.balances[account].balance,
              pending: json.balances[account].pending,
            });
          });
    });
  };

  const getAccountsBalances = async (accounts) => {
    /* istanbul ignore if */
    if (accounts == undefined || !Array.isArray(accounts)) {
      throw Error(`'accounts' is a required parameter.`);
    }
    const formData = {
      action: 'accounts_balances',
      accounts: accounts,
    };
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log(`accounts_balances error '${error.message}'`);
            reject(error);
          })
          .then((json) => {
            if (json === undefined || json.balances === undefined) {
              resolve();
              return;
            }
            // console.log('accounts_balances json', json);
            resolve(json);
          });
    });
  };

  const getAccountRepresentative = async (account) => {
    /* istanbul ignore if */
    if (account == undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    // https://docs.nano.org/commands/rpc-protocol#account-representative
    const formData = {
      action: 'account_representative',
      account: account,
    };
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `account_representative error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
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
    /* istanbul ignore if */
    if (account == undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    // https://docs.nano.org/commands/rpc-protocol#frontiers
    const formData = {
      action: 'accounts_frontiers',
      accounts: [account],
      count: 1,
    };
    // console.log( `accounts_frontiers request ${account}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `accounts_frontiers error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `accounts_frontiers response ${JSON.stringify( json )}` );
            if (json === undefined) {
              resolve('');
            } else if (json.frontiers == undefined) {
            // console.log( `accounts_frontiers response ${account}` );
              resolve('');
            } else if (json.frontiers == '') {
            // console.log( `accounts_frontiers response ${account}` );
              resolve('');
            } else {
              const previous = json.frontiers[account];
              // console.log( `accounts_frontiers response ${account} ${previous}` );
              resolve(previous);
            }
          });
    });
  };

  const getAccountHistory = async (account, count, head, raw) => {
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    /* istanbul ignore if */
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

    // console.log( `account_history request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `account_history error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `account_history response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getAccountInfo = async (account, representativeFlag) => {
    /* istanbul ignore if */
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

    // console.log( `account_info request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `account_info error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `account_info response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getBlocks = async (hashes, jsonBlock) => {
    /* istanbul ignore if */
    if (hashes === undefined) {
      throw Error(`'hashes' is a required parameter.`);
    }
    // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#retrieve-multiple-blocks
    const formData = {
      action: 'blocks',
      hashes: hashes,
    };

    if (jsonBlock !== undefined) {
      formData.json_block = jsonBlock;
    }

    // console.log( `blocks request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `blocks error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `blocks response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const process = async (block, subtype) => {
    /* istanbul ignore if */
    if (block == undefined) {
      throw Error(`'block' is a required parameter.'`);
    }
    /* istanbul ignore if */
    if (subtype == undefined) {
      throw Error(`'subtype' is a required parameter.'`);
    }

    // https://docs.nano.org/commands/rpc-protocol/#process
    const formData = {
      action: 'process',
      json_block: 'true',
      subtype: subtype,
      block: block,
    };
    // console.log( `process block`, block, block.work );
    if (block.work === undefined) {
      formData.do_work = true;
    }
    // console.log( `process request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `process error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `process response ${JSON.stringify( json )}` );
            if (json === undefined) {
              resolve('');
            } else {
              if (json.hash === undefined) {
              // console.log(`process hash undefined`);
                if (json.error === undefined) {
                // console.log(`process error undefined`);
                  const jsonStr = JSON.stringify(json);
                  // console.log(`process reject ${jsonStr}`);
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

    /* istanbul ignore if */
    if (LOG_GET_GENERATED_WORK) {
      console.log(
          `STARTED getGeneratedWork request ${JSON.stringify(formData)}`,
      );
    }

    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `getGeneratedWork error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            if (json === undefined) {
              resolve('');
            } else {
            /* istanbul ignore if */
              if (LOG_GET_GENERATED_WORK) {
                console.log(
                    `SUCCESS getGeneratedWork response ${JSON.stringify(json)}`,
                );
              }
              const work = json.work;
              resolve(work);
            }
          });
    });
  };

  const getAccountsPending = async (accounts, count, source) => {
    /* istanbul ignore if */
    if (accounts === undefined) {
      throw Error('accounts is a required parameter.');
    }
    /* istanbul ignore if */
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
    // console.log( `accounts_pending request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `accounts_pending error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `accounts_pending response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getBlockAccount = async (hash) => {
    /* istanbul ignore if */
    if (hash === undefined) {
      throw Error('hash is a required parameter.');
    }
    // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#block-account
    const formData = {
      action: 'block_account',
      hash: hash,
    };
    // console.log( `block_account request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `block_account error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `block_account response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getFrontiers = async (account, count) => {
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error('account is a required parameter.');
    }
    /* istanbul ignore if */
    if (count === undefined) {
      throw Error('count is a required parameter.');
    }
    // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#frontiers
    const formData = {
      action: 'frontiers',
      account: account,
      count: count,
    };
    // console.log( `frontiers request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `frontiers error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `frontiers response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getBlockCount = async () => {
    // https://docs.nano.org/commands/rpc-protocol/#block_count
    const formData = {
      action: 'block_count',
    };
    // console.log( `block_count request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
          // console.log( `block_count error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
          // console.log( `block_count response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const setUrl = (newUrl) => {
    // console.log('started serUrl', newUrl);
    url = newUrl;
    if (url !== undefined) {
      if (url.startsWith('https')) {
        moduleRef = https;
      } else if (url.startsWith('http')) {
        moduleRef = http;
      }
    }
    // console.log('success serUrl', newUrl, url);
  };

  const getModuleRef = () => {
    return moduleRef;
  };

  const setModuleRef = (newModuleRef) => {
    moduleRef = newModuleRef;
  };

  const setUseRateLimit = (newUseRateLimit) => {
    // console.log('setUseRateLimit', newUseRateLimit);
    useRateLimit = newUseRateLimit;
  };

  const setLogRequestErrors = (newLogRequestErrors) => {
    logRequestErrors = newLogRequestErrors;
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.setUrl = setUrl;
    exports.delay = delay;
    exports.setModuleRef = setModuleRef;
    exports.getModuleRef = getModuleRef;
    exports.setLogRequestErrors = setLogRequestErrors;
    exports.setUseRateLimit = setUseRateLimit;
    exports.getFrontiers = getFrontiers;
    exports.getBlockAccount = getBlockAccount;
    exports.getAccountsPending = getAccountsPending;
    exports.getAccountBalanceRaw = getAccountBalanceRaw;
    exports.getAccountBalanceAndPendingRaw = getAccountBalanceAndPendingRaw;
    exports.getAccountsBalances = getAccountsBalances;
    exports.getAccountRepresentative = getAccountRepresentative;
    exports.getPrevious = getPrevious;
    exports.process = process;
    exports.getGeneratedWork = getGeneratedWork;
    exports.getAccountHistory = getAccountHistory;
    exports.getAccountInfo = getAccountInfo;
    exports.getBlocks = getBlocks;
    exports.getBlockCount = getBlockCount;
    exports.sendRequest = sendRequest;
    exports.log = console.log;
    exports.trace = console.trace;
    exports.setAuth = setAuth;
    exports.setHeaders = setHeaders;

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
