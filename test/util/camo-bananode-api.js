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
  if (account == 'nano_1w8shy6om7ts74piy619x3aqpxb96nmc476p7mh59absweoicnrg5wqmz1kd') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }

  if (account == 'ban_3jfbronhgapg9usdisp5rt4ioh65aajzp8woryt4jpxpakgpi5syfx96khed') {
    return await bananodeApi.getAccountHistory(account, count, head, raw);
  }

  if (account == 'nano_3jfbronhgapg9usdisp5rt4ioh65aajzp8woryt4jpxpakgpi5syfx96khed') {
    return await bananodeApi.getAccountHistory(account, count, head, raw);
  }
  if (account == 'ban_39y66s786kbejeyohok53jfx3qoc78bapqc3hec8qgrswjrjskefqyhjrjsc') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }
  if (account == 'nano_39y66s786kbejeyohok53jfx3qoc78bapqc3hec8qgrswjrjskefqyhjrjsc') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }
  if (account == 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7') {
    return await bananodeApi.getAccountHistory(account, count, head, raw);
  }
  if (account == 'nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7') {
    return await bananodeApi.getAccountHistory(account, count, head, raw);
  }
  if (account == 'ban_3rrf6cus8pye6o1kzi5n6wwjof8bjb7ff4xcgesi3njxid6x64pms6onw1f9') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }
  if (account == 'nano_3rrf6cus8pye6o1kzi5n6wwjof8bjb7ff4xcgesi3njxid6x64pms6onw1f9') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }
  if (account == 'ban_1jzp4mwnx9htxrycg9dbsgo4psk4yd1u4z1twsngz5ei6fk3gf395w8ponjs') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }
  if (account == 'nano_1jzp4mwnx9htxrycg9dbsgo4psk4yd1u4z1twsngz5ei6fk3gf395w8ponjs') {
    const retval = {};
    retval.account = account;
    retval.history = [];
    retval.previous = '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72';
    return retval;
  }

  throw Error('unknown account:' + account);
};

const getGeneratedWork = async (hash) => {
  let defaultWork = undefined;
  if (hash == '70D97F8959975928AD0F1007E8517B75272526A114962CDE33A139E32B05530E') {
    defaultWork = 'BEB5C70000000000';
  }
  if (hash == '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F') {
    defaultWork = 'FD7B280000000000';
  }
  if (hash == '9FC4264A62492C8B3D57D6430C5BD0DEAA29928B5D417B146BBB19E4711CC98D') {
    defaultWork = '9B003C0100000000';
  }
  if (hash == '47F614F94E9DFAEE3CA71D69CBAA2B6642F2C1B17C1AE668EF8D902364173427') {
    defaultWork = '2E083C0000000000';
  }
  if (hash == 'C5A9C568F722CE3EF2B866C3C6850ABC834223FB1B95C7B428DBB6449D680F3E') {
    defaultWork = '3C484C0000000000';
  }

  if (defaultWork !== undefined) {
    const workBytes = bananoUtil.hexToBytes(defaultWork).reverse();
    const hashBytes = bananoUtil.hexToBytes(hash);
    const isWorkValid = bananoUtil.isWorkValid(hashBytes, workBytes);
    if (isWorkValid) {
      return defaultWork;
    }
  }

  return await bananodeApi.getGeneratedWork(hash);
};

const getAccountBalanceRaw = (account) => {
  if (account == 'ban_13pg5mmpp718zzypyxsmfni8td7fknspnzjanhd7crccmpnd36po7njq7m18') {
    const json = {};
    json.balances = {};
    json.balances[account] = {};
    json.balances[account].balance = '000000000000000000000000000000';
    json.balances[account].pending = '000000000000000000000000000000';

    const balance = json.balances[account].balance;

    return balance;
  }
  if (account == 'nano_13pg5mmpp718zzypyxsmfni8td7fknspnzjanhd7crccmpnd36po7njq7m18') {
    const json = {};
    json.balances = {};
    json.balances[account] = {};
    json.balances[account].balance = '000000000000000000000000000000';
    json.balances[account].pending = '000000000000000000000000000000';

    const balance = json.balances[account].balance;

    return balance;
  }
  return bananodeApi.getAccountBalanceRaw(account);
};

exports.getAccountBalanceRaw = getAccountBalanceRaw;
exports.getAccountRepresentative = bananodeApi.getAccountRepresentative;
exports.getPrevious = bananodeApi.getPrevious;
exports.process = bananodeApi.process;
exports.getGeneratedWork = getGeneratedWork;
exports.getAccountInfo = bananodeApi.getAccountInfo;
exports.getAccountsPending = bananodeApi.getAccountsPending;
exports.getAccountHistory = getAccountHistory;
exports.getFrontiers = bananodeApi.getFrontiers;
