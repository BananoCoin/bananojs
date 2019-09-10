const fetch = require('node-fetch');
const ACTIONS = require('./actions');

const LOG_GET_GENERATED_WORK = false;

const jsonHeader = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

let url;

const sendRequest = async (formData) => {
  if (formData == undefined) {
    throw Error(`'formData' is a required parameter.`);
  }

  return fetch( url, {
    headers: jsonHeader,
    body: ( typeof formData !== 'string' ) ? JSON.stringify( formData ) : formData,
    method: 'POST',
  } )
  .then( res => res.json() )
  .catch( err => {
    console.error( err );
    throw err;
  } );
};

const getAccountBalanceRaw = async (account) => {
  if (account == undefined) {
    throw Error(`'account' is a required parameter.`);
  }

  const formData = ACTIONS.ACCOUNTS_BALANCES( account );

  const { balances } = await sendRequest( formData );

  return ( balances && Array.isArray( balances ) ) ? balances[ account ].balance : '';
};

const getAccountRepresentative = async (account) => {
  if (account == undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#account-representative
  const formData = ACTIONS.ACCOUNT_REPRESENTATIVE( account );

  const { representative } = await sendRequest( formData );

  return representative || '';
};

const getPrevious = async (account) => {
  if (account == undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#frontiers
  const formData = ACTIONS.ACCOUNTS_FRONTIERS( account );

  const { frontiers } = await sendRequest( formData );

  return ( frontiers && Array.isArray( frontiers ) ) ? frontiers[ account ] : '';
};


const getAccountHistory = async (account, count, head, raw) => {
  if (account === undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  if (count === undefined) {
    throw Error(`'count' is a required parameter.`);
  }
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#account-history

  const formData = ACTIONS.ACCOUNT_HISTORY( account, count );

  const history = await sendRequest( formData );

  return history || null;
};

const getAccountInfo = async (account) => {
  if (account === undefined) {
    throw Error(`'account' is a required parameter.`);
  }
  // https://docs.nano.org/commands/rpc-protocol/#account_info

  const formData = ACTIONS.ACCOUNT_INFO( account );

  const infos = await sendRequest( formData );

  return infos || null;
};

const getBlocks = async (hashes, source) => {
  if (hashes === undefined) {
    throw Error(`'hashes' is a required parameter.`);
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#retrieve-multiple-blocks
  
  const formData = ACTIONS.BLOCKS( hashes );

  const blocks = await sendRequest( formData );

  return blocks || null;
};

const process = async (block) => {
  if (block == undefined) {
    throw Error(`'block' is a required parameter.'`);
  }
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#process-block

  const formData = ACTIONS.PROCESS( JSON.stringify( block ) );

  const { hash } = await sendRequest( formData );

  return hash || '';
};


/**
 * note: enable_control required.
 */
const getGeneratedWork = async (hash) => {
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#work-generate
  
  const formData = ACTIONS.WORK_GENERATE( hash );

  if (LOG_GET_GENERATED_WORK) {
    console.log(`STARTED getGeneratedWork request ${JSON.stringify( formData )}`);
  }

  const { work } = await sendRequest( formData );

  return work || '';
};

const getAccountsPending = async (accounts, count) => {
  if (accounts === undefined) {
    throw Error('accounts is a required parameter.');
  }
  if (count === undefined) {
    throw Error('count is a required parameter.');
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#accounts-pending

  const formData = ACTIONS.ACCOUNTS_PENDING( accounts, count );

  const accPending = await sendRequest( formData );

  return accPending || null;
};

const getBlockAccount = async (hash) => {
  if (hash === undefined) {
    throw Error('hash is a required parameter.');
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#block-account

  const formData = ACTIONS.BLOCK_ACCOUNT( hash );

  const blockAccount = await sendRequest( formData );

  return blockAccount || null;
};

const getFrontiers = async (account, count) => {
  if (account === undefined) {
    throw Error('account is a required parameter.');
  }
  if (count === undefined) {
    throw Error('count is a required parameter.');
  }
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#frontiers

  const formData = ACTIONS.FRONTIERS( account, count );

  const frontiers = await sendRequest( formData );

  return frontiers || null;
};

const setUrl = newUrl => url = newUrl;

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
