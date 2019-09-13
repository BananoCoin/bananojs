// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const bananoAccount = bananoTest.account;

describe('send', () => {
  it('sendAmountToAccount valid account matches expected', (done) => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const successCallback = () => {
      done();
    };
    const failureCallback = (error) => {
      throw error;
    };
    bananojs.sendAmountToAccount(seed0, seedIx, bananoAccount, 1, successCallback, failureCallback);
  });
  it('sendAmountToAccount error', async () => {
    const bananojs = testUtil.getBananojsWithErrorApi();
    const successCallback = () => {
      done();
    };
    const failureCallback = (error) => {
      throw error;
    };
    const message = 'Error: getAccountInfo account:ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7';
    testUtil.expectErrorMessage(message, bananojs.sendAmountToAccount, seed0, seedIx, bananoAccount, 1, successCallback, failureCallback);
  });
  it('sendAmountToAccount processing error', async () => {
    const bananojs = testUtil.getBananojsWithProcessErrorApi();
    const successCallback = () => {
      done();
    };
    const failureCallback = (error) => {
      throw error;
    };
    const message = 'Error: process block:[object Object]';
    testUtil.expectErrorMessage(message, bananojs.sendAmountToAccount, seed0, seedIx, bananoAccount, 1, successCallback, failureCallback);
  });
});
