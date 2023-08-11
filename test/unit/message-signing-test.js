'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const expectedMessageSignature =
  '36DA6CEE694A54F40A82C62C3DBF75AAF8425D50821DCCECCB931DCEB6B4938F7FD9B420FDFB1924BE2208085FD607471A57649E7DB964623D280D3AD37C2D0A';

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

  it('different signed messages generates different signatures', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const signature1 = await bananojs.signMessage(privateKey, 'test1');
    const signature2 = await bananojs.signMessage(privateKey, 'test2');
    expect(signature1).to.not.equal(signature2);
  });

  it('different signed messages without numbers generates different signatures', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const signature1 = await bananojs.signMessage(privateKey, 'abcd');
    const signature2 = await bananojs.signMessage(privateKey, 'test');
    expect(signature1).to.not.equal(signature2);
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
