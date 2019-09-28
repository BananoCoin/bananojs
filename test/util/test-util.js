// libraries
const chai = require('chai');
const BigNumber = require('bignumber.js');

// modules
const bananojs = require('../../index.js');
const assert = chai.assert;
const expect = chai.expect;

const getTimeNanos = () => {
  return new BigNumber(process.hrtime.bigint());
};

const getBananojsWithMockApi = () => {
  const bananodeApi = require('./mock-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithErrorApi = () => {
  const bananodeApi = require('./everything-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithProcessErrorApi = () => {
  const bananodeApi = require('./process-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithBalanceErrorApi = () => {
  const bananodeApi = require('./balance-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const expectErrorMessage = async (errorMessage, fn, arg1, arg2, arg3, arg4, arg5, arg6) => {
  try {
    await fn(arg1, arg2, arg3, arg4, arg5, arg6);
  } catch (err) {
    assert.isDefined(err);
    if (err.message != errorMessage) {
      // console.trace('expectErrorMessage', errorMessage, fn, err);
      assert.fail(`expected:'${errorMessage}'<>actual:'${err.message}'`);
    }
    return;
  }
  assert.fail(`no error was thrown, expected err.message='${errorMessage}'`);
};

const deactivate = () => {
  bananojs.setBananodeApi(undefined);
};

exports.getTimeNanos = getTimeNanos;
exports.getBananojsWithMockApi = getBananojsWithMockApi;
exports.getBananojsWithErrorApi = getBananojsWithErrorApi;
exports.getBananojsWithProcessErrorApi = getBananojsWithProcessErrorApi;
exports.getBananojsWithBalanceErrorApi = getBananojsWithBalanceErrorApi;
exports.expectErrorMessage = expectErrorMessage;
exports.deactivate = deactivate;
