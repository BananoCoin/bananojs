'use strict';

const bananodeApi = require('./mock-bananode-api.js');

const bananojs = require('../../index.js');

const process = async (block) => {
  const hash = bananojs.getBlockHash(block);
  return new Promise((resolve, reject) => {
    const json = {};
    json.error = 'Fork';
    reject(json);
  });
};

exports.getAccountBalanceRaw = bananodeApi.getAccountBalanceRaw;
exports.getAccountRepresentative = bananodeApi.getAccountRepresentative;
exports.getPrevious = bananodeApi.getPrevious;
exports.process = process;
exports.getGeneratedWork = bananodeApi.getGeneratedWork;
exports.getAccountInfo = bananodeApi.getAccountInfo;
exports.getAccountsPending = bananodeApi.getAccountsPending;
exports.getAccountHistory = bananodeApi.getAccountHistory;
exports.getFrontiers = bananodeApi.getFrontiers;
