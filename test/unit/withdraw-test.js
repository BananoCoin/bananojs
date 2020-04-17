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
const coinDatas = testUtil.getCoinDatas(bananoTest);
const amountBananos = '1';

describe('withdraw', () => {
  coinDatas.forEach((coinData) => {
    it(coinData.coin + ' sendWithdrawalFromSeed valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const expectedResponse= '5631DAB5FAF51C8163E054E332951E6BE765BFEFA1AE609A8E942D5B090FCE09';
      const sendWithdrawalFromSeed = coinData.getSendWithdrawalFromSeedFn(bananojs);
      const toAccount = coinData.toAccount;
      const actualResponse = await sendWithdrawalFromSeed(seed0, seedIx, toAccount, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
