'use strict';
const bananoUtil = require('../../app/scripts/banano-util.js');

const bananodeApi = require('./mock-bananode-api.js');

const getAccountHistory = async (account, count, head, raw) => {
  if (account == 'ban_1w8shy6om7ts74piy619x3aqpxb96nmc476p7mh59absweoicnrg5wqmz1kd') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }
  throw Error('unknown account:' + account);
};

const getGeneratedWork = async (hash) => {
  let defaultWork = '';
  if (hash == '70D97F8959975928AD0F1007E8517B75272526A114962CDE33A139E32B05530E') {
    defaultWork = 'BEB5C70000000000';
  }
  // if (defaultWork == undefined) {
  //   throw Error(`unknown hash ${hash} sent to getGeneratedWork`);
  // }

  const workBytes = bananoUtil.hexToBytes(defaultWork).reverse();
  const hashBytes = bananoUtil.hexToBytes(hash);
  const isWorkValid = bananoUtil.isWorkValid(hashBytes, workBytes);
  if (isWorkValid) {
    return defaultWork;
  }
  const work = bananoUtil.getHashCPUWorker(hash, bananoUtil.getZeroedWorkBytes());
  throw Error( `getGeneratedWork work ${work} for hash ${hash}` );
  return work;
};

exports.getAccountBalanceRaw = bananodeApi.getAccountBalanceRaw;
exports.getAccountRepresentative = bananodeApi.getAccountRepresentative;
exports.getPrevious = bananodeApi.getPrevious;
exports.process = bananodeApi.process;
exports.getGeneratedWork = getGeneratedWork;
exports.getAccountInfo = bananodeApi.getAccountInfo;
exports.getAccountsPending = bananodeApi.getAccountsPending;
exports.getAccountHistory = getAccountHistory;
exports.getFrontiers = bananodeApi.getFrontiers;
