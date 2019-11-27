'use strict';

// libraries
const chai = require('chai');

// modules
const bananojs = require('../../index.js');
const assert = chai.assert;
const expect = chai.expect;

const getTimeNanos = () => {
  return BigInt(process.hrtime.bigint());
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

const getBananojsWithPendingErrorApi = () => {
  const bananodeApi = require('./pending-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithAccountRepresentativeUndefinedApi = () => {
  const bananodeApi = require('./representative-undefined-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithAccountInfoBalanceErrorApi = () => {
  const bananodeApi = require('./account-info-balance-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithAccountInfoErrorApi = () => {
  const bananodeApi = require('./account-info-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithCamoApi = () => {
  const bananodeApi = require('./camo-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const expectErrorMessage = async (errorMessage, fn, arg1, arg2, arg3, arg4, arg5, arg6) => {
  try {
    await fn(arg1, arg2, arg3, arg4, arg5, arg6);
  } catch (err) {
    assert.isDefined(err);
    expect(errorMessage).to.deep.equal(err.message);
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
exports.getBananojsWithAccountInfoBalanceErrorApi = getBananojsWithAccountInfoBalanceErrorApi;
exports.getBananojsWithAccountInfoErrorApi = getBananojsWithAccountInfoErrorApi;
exports.getBananojsWithCamoApi = getBananojsWithCamoApi;
exports.getBananojsWithPendingErrorApi = getBananojsWithPendingErrorApi;
exports.getBananojsWithAccountRepresentativeUndefinedApi = getBananojsWithAccountRepresentativeUndefinedApi;
exports.expectErrorMessage = expectErrorMessage;
exports.deactivate = deactivate;
