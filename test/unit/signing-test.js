// const assert = require('chai').assert;
const expect = require('chai').expect;

const bananoTest = require('./banano-test.json');

const bananojs = require('../util/test-util.js').getBananojsWithMockApi();

const bad = {};
bad.seed = 'F975E272ECAF243CB30D3DAB4473F14A482A255A46AE140B1F96F5A1F32F3D51';
bad.account = 'ban_1bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';

const expectedWorkStart = 'FD7B270000000000';
const expectedWork = 'FD7B280000000000';
const expectedWorkHash = '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';

const privateKey = bananoTest.privateKey;
const block = bananoTest.block;
const signature = bananoTest.signature;
const hash = bananoTest.hash;
const accountPublicKey = bananoTest.accountPublicKey;
const bananoAccount = bananoTest.account;
const bananoSeed = bananoTest.seed;

describe('block-sign', () => {
  it('accountPublicKey matches expected', () => {
    const expectedAccountPublicKey = accountPublicKey;

    const actualAccountPublicKey = bananojs.getAccountPublicKey(block.account);

    expect(expectedAccountPublicKey).to.deep.equal(actualAccountPublicKey);
  });
  it('hash of block matches expected', () => {
    const expectedHash = hash;

    const actualHash = bananojs.getHash(block);

    expect(expectedHash).to.deep.equal(actualHash);
  });
  it('signature of block matches expected', () => {
    const expectedSignature = signature;

    const actualSignature = bananojs.getSignature(privateKey, block);

    expect(expectedSignature).to.deep.equal(actualSignature);
  });
  it('send works, good account', (done) => {
    const successCallback = () => {
      done();
    };
    const failureCallback = (error) => {
      throw error;
    };
    bananojs.sendAmountToAccount(bananoSeed, 0, bananoAccount, 1, successCallback, failureCallback);
  });
  it('send works, bad account', (done) => {
    const successCallback = () => {
      done();
    };
    const failureCallback = (error) => {
      throw error;
    };
    bananojs.sendAmountToAccount(bad.seed, 0, bad.account, 1, successCallback, failureCallback);
  });
  it('getWork works', () => {
    const workBytes = bananojs.getBytesFromHex(expectedWorkStart).reverse();
    const actualWork = bananojs.getWorkUsingCpu(expectedWorkHash, workBytes);
    expect(expectedWork).to.deep.equal(actualWork);
  });
});
