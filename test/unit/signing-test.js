'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');
const coinDatas = testUtil.getCoinDatas(bananoTest);

const expectedWorkStart = 'FD7B270000000000';
const expectedWork = 'FD7B280000000000';
const expectedWorkHash = '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';

const privateKey = bananoTest.privateKey;
const block = bananoTest.block;
const signature = bananoTest.signature;
const hash = bananoTest.hash;
const accountPublicKey = bananoTest.accountPublicKey;
const bananoSeed = bananoTest.seed;

describe('block-sign', () => {
  coinDatas.forEach((coinData) => {
    const bad = coinData.bad;
    const bananoAccount = coinData.toAccount;
    it(coinData.coin + ' send works, good account', (done) => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const successCallback = () => {
        done();
      };
      const failureCallback = (error) => {
        throw error;
      };
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      sendAmountToAccount(bananoSeed, 0, bananoAccount, 1, successCallback, failureCallback);
    });
    it(coinData.coin + ' send works, bad account', (done) => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const successCallback = () => {
        done();
      };
      const failureCallback = (error) => {
        throw error;
      };
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      sendAmountToAccount(bad.seed, 0, bad.account, 1, successCallback, failureCallback);
    });
  });

  it('accountPublicKey matches expected', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedAccountPublicKey = accountPublicKey;
    const actualAccountPublicKey = bananojs.getAccountPublicKey(block.account);
    expect(expectedAccountPublicKey).to.deep.equal(actualAccountPublicKey);
  });
  it('hash of block matches expected', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedHash = hash;
    const actualHash = bananojs.getBlockHash(block);
    expect(expectedHash).to.deep.equal(actualHash);
  });
  it('signature of block matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedSignature = signature;
    const actualSignature = await bananojs.getSignature(privateKey, block);
    expect(expectedSignature).to.deep.equal(actualSignature);
  });
  it('getWork works', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const workBytes = bananojs.getBytesFromHex(expectedWorkStart).reverse();
    const actualWork = bananojs.getWorkUsingCpu(expectedWorkHash, workBytes);
    expect(expectedWork).to.deep.equal(actualWork);
  });
  it('getZeroedWorkBytes', () => {
    const expectedWorkBytes = new Uint8Array(8);
    const bananojs = testUtil.getBananojsWithMockApi();
    const actualWorkBytes = bananojs.getZeroedWorkBytes();
    expect(expectedWorkBytes).to.deep.equal(actualWorkBytes);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
