
const bananodeApi = require('./mock-bananode-api.js');

const process = (block) => {
  throw new Error(`process block:${block}`);
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
