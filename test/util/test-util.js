const BigNumber = require('bignumber.js');

const getTimeNanos = () => {
  return new BigNumber(process.hrtime.bigint());
};

const getBananojsWithMockApi = () => {
  const bananojs = require('../../index.js');
  const bananodeApi = require('./mock-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

exports.getTimeNanos = getTimeNanos;
exports.getBananojsWithMockApi = getBananojsWithMockApi;
