'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');
const coinDatas = testUtil.getCoinDatas(bananoTest);

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const pendingBlockHash = bananoTest.pendingBlockHash;
const pendingValueRaw = bananoTest.pendingValueRaw;

describe('open', () => {
  coinDatas.forEach((coinData) => {
    const representative1 = coinData.representative1;
    it(coinData.coin + ' openAccountFromSeed valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const expectedResponse= '32ECFCF11DF3B6331A52B456CDC7252282C04230759776FA734CF13432207BE8';
      const openAccountFromSeed = coinData.getOpenAccountFromSeedFn(bananojs);
      const actualResponse = await openAccountFromSeed(seed0, seedIx, representative1, pendingBlockHash, pendingValueRaw);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' openAccountFromSeed error', async () => {
      const bananojs = testUtil.getBananojsWithErrorApi();
      const message = 'getGeneratedWork hash:C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B';
      const openAccountFromSeed = coinData.getOpenAccountFromSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, openAccountFromSeed, seed0, seedIx, representative1, pendingBlockHash, pendingValueRaw);
    });
    it(coinData.coin + ' openAccountFromSeed processing error', async () => {
      const bananojs = testUtil.getBananojsWithProcessErrorApi();
      const message = 'process block:32ECFCF11DF3B6331A52B456CDC7252282C04230759776FA734CF13432207BE8';
      const openAccountFromSeed = coinData.getOpenAccountFromSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, openAccountFromSeed, seed0, seedIx, representative1, pendingBlockHash, pendingValueRaw);
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
