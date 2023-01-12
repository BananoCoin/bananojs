'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const expectedMessageSignature =
  '66131ABCD9E65E59DE10C6A16AEC43424536CA66A0762B118DC3DFB9AC85C9661F5F757E8BFBF1EFFFE308C6D48E461279BBFFEE312745ADA31248E60DAE180A';

const privateKey = bananoTest.privateKey;

describe('message-sign', () => {
  it('signature matches expected', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const actualMessageSignature = bananojs.signMessage(privateKey, "test");
    expect(actualMessageSignature).to.deep.equal(expectedMessageSignature);
  });

  it('signed message is verified', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const signature = bananojs.signMessage(privateKey, "test");
    const publicKey = window.bananocoinBananojs.getPublicKey(privateKey);
    const signatureVerify = bananojs.verifyMessage(publicKey, "test", signature);
    expect(signatureVerify).to.deep.equal(true);
  });

  it('invalid message is rejected', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const signature = bananojs.signMessage(privateKey, "test");
    const publicKey = window.bananocoinBananojs.getPublicKey(privateKey);
    const signatureVerify = bananojs.verifyMessage(publicKey, "afjskfjsd7", signature);
    expect(signatureVerify).to.deep.equal(false);
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
