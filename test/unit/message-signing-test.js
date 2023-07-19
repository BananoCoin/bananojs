'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const expectedMessageSignature =
  '93DF9DD1E2BFB2DFB28C12B300BC03D6F5EACCDF7B828ED7B77EACE47B1066257816325525139242CC9011878846E2D88013DB3370FCB56375319D00AD8C5307';

const privateKey = bananoTest.privateKey;

describe('message-sign', () => {
  it('signature matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const actualMessageSignature = await bananojs.signMessage(privateKey, 'test');
    expect(actualMessageSignature).to.deep.equal(expectedMessageSignature);
  });

  it('signed message is verified', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const signature = await bananojs.signMessage(privateKey, 'test');
    const publicKey = await bananojs.getPublicKey(privateKey);
    const signatureVerify = bananojs.verifyMessage(publicKey, 'test', signature);
    expect(signatureVerify).to.deep.equal(true);
  });

  it('invalid message is rejected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const signature = await bananojs.signMessage(privateKey, 'test');
    const publicKey = await bananojs.getPublicKey(privateKey);
    const signatureVerify = bananojs.verifyMessage(publicKey, 'afjskfjsd7', signature);
    expect(signatureVerify).to.deep.equal(false);
  });

  it('generates expected dummy block hash from public key bytes', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const publicKey = await bananojs.getPublicKey(privateKey);
    const publicKeyBytes = bananojs.BananoUtil.hexToBytes(publicKey);
    const block = bananojs.messageDummyBlock(publicKeyBytes, 'test');
    const account = bananojs.getAccount(publicKey, 'ban_');
    expect(account).to.equal(block.account);
  });

  it('generates expected dummy block hash', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const publicKey = await bananojs.getPublicKey(privateKey);
    const hashedMessageBytes = bananojs.hashMessageToBytes('test');
    const dummyBlockHashBytes = bananojs.messageDummyBlockHashBytes(publicKey, 'test');

    const dummyBlockHash = bananojs.getHexFromBytes(dummyBlockHashBytes);

    const block = bananojs.messageDummyBlock(publicKey, 'test');

    const hashedMessage = bananojs.getHexFromBytes(hashedMessageBytes);
    const representative = bananojs.getAccount(hashedMessage, 'ban_');
    expect(representative).to.equal(block.representative);

    const manualDummyBlockHash = bananojs.getBlockHash(block);
    expect(dummyBlockHash).to.equal(manualDummyBlockHash);
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
