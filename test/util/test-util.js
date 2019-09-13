// libraries
const chai = require('chai');
const BigNumber = require('bignumber.js');

// modules
const assert = chai.assert;
const expect = chai.expect;

const getTimeNanos = () => {
  return new BigNumber(process.hrtime.bigint());
};

const getBananojsWithMockApi = () => {
  const bananojs = require('../../index.js');
  const bananodeApi = require('./mock-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithErrorApi = () => {
  const bananojs = require('../../index.js');
  const bananodeApi = require('./everything-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithProcessErrorApi = () => {
  const bananojs = require('../../index.js');
  const bananodeApi = require('./process-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};


const expectErrorMessage = async (errorMessage, fn, arg1, arg2, arg3, arg4) => {
  try {
    await fn(arg1, arg2, arg3, arg4);
  } catch (err) {
    assert.isDefined(err);
    if (err.message != errorMessage) {
      console.trace('expectErrorMessage', errorMessage, fn, err);
      expect(err.message).to.equal(errorMessage);
    }
    return;
  }
  assert.fail(`no error was thrown, expected err.message='${errorMessage}'`);
};

exports.getTimeNanos = getTimeNanos;
exports.getBananojsWithMockApi = getBananojsWithMockApi;
exports.getBananojsWithErrorApi = getBananojsWithErrorApi;
exports.getBananojsWithProcessErrorApi = getBananojsWithProcessErrorApi;
exports.expectErrorMessage = expectErrorMessage;
