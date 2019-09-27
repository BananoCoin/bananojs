const bananoUtil = require('../../app/scripts/banano-util.js');

const getAccountBalanceRaw = (account) => {
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#accounts-balances

  const json = {};
  json.balances = {};
  json.balances[account] = {};
  json.balances[account].balance = '10' + '00000000000000000000000000000';
  json.balances[account].pending = '000000000000000000000000000000';

  const balance = json.balances[account].balance;

  return balance;
};

const getAccountRepresentative = (account) => {
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#account-representative
  const retval = {};
  retval.representative = account;
  return retval.representative;
};

const getPrevious = (account) => {
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#frontiers
  if (account.startsWith('ban_1bad1')) {
    return '';
  }
  const retval = {};
  retval.frontiers = {};
  retval.frontiers[account] = '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
  const previous = retval.frontiers[account];
  return previous;
};


const process = async (block) => {
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#process-block
  const retval = {};
  retval.hash = '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
  return retval.hash;
};

const getGeneratedWork = async (hash) => {
  let defaultWork = undefined;
  if (hash == '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F') {
    defaultWork = 'FD7B280000000000';
  }
  if (hash == 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B') {
    defaultWork = 'F5E2210000000000';
  }
  if (defaultWork == undefined) {
    throw Error(`unknown hash ${hash} sent to getGeneratedWork`);
  }
  // console.log( `getGeneratedWork hash ${hash} defaultWork ${defaultWork}` );

  const workBytes = bananoUtil.hexToBytes(defaultWork).reverse();
  const hashBytes = bananoUtil.hexToBytes(hash);
  const isWorkValid = bananoUtil.isWorkValid(hashBytes, workBytes);
  // console.log( `getGeneratedWork defaultWork ${defaultWork} valid for hash ${hash} : ${isWorkValid}` );
  if (isWorkValid) {
    return defaultWork;
  }
  const work = bananoUtil.getHashCPUWorker(hash);
  // console.log( `getGeneratedWork work ${work} for hash ${JSON.stringify( hash )}` );
  return work;
};

const getAccountsPending = async (accounts, count) => {
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#accounts-pending
  const retval = {};
  retval.blocks = {};
  accounts.forEach((account) => {
    retval.blocks[account] = {};
    retval.blocks[account]['142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D'] = 1;
  });
  return retval;
};

const getAccountHistory = async (account, count, head, raw) => {
  // https://github.com/nanocurrency/raiblocks/wiki/RPC-protocol#account-history
  const retval = {};
  retval.account = account;
  retval.history = [];
  retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
  const block = {};
  retval.history.push(block);
  block.type = 'send';
  block.account = account;
  block.local_timestamp = '1551532723';
  block.height = '60';
  block.hash = '80392607E85E73CC3E94B4126F24488EBDFEB174944B890C97E8F36D89591DC5';
  return retval;
};

const getFrontiers = async (account, count) => {
  // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#frontiers
  const retval = {};
  retval.frontiers = {};
  retval.frontiers[account] = '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
  return retval;
};

const getAccountInfo = async (account) => {
  const retval = {};
  retval.frontier = '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
  retval.open_block = '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948';
  retval.representative_block = '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948';
  retval.balance = '10' + '00000000000000000000000000000';
  retval.modified_timestamp = '1501793775';
  retval.block_count = '33';
  retval.confirmation_height = '28';
  retval.account_version = '1';
  return retval;
};

const setUrl = () => {
  
}

exports.getAccountBalanceRaw = getAccountBalanceRaw;
exports.getAccountRepresentative = getAccountRepresentative;
exports.getPrevious = getPrevious;
exports.process = process;
exports.getGeneratedWork = getGeneratedWork;
exports.getAccountsPending = getAccountsPending;
exports.getAccountHistory = getAccountHistory;
exports.getAccountInfo = getAccountInfo;
exports.getFrontiers = getFrontiers;
exports.setUrl = setUrl;
