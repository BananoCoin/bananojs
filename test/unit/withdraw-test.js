'use strict';

// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const toAccount = bananoTest.account;
const amountBananos = '1';

describe('withdraw', () => {
  it('sendWithdrawalFromSeed valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedResponse= '5631DAB5FAF51C8163E054E332951E6BE765BFEFA1AE609A8E942D5B090FCE09';
    const actualResponse = await bananojs.sendWithdrawalFromSeed(seed0, seedIx, toAccount, amountBananos);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
