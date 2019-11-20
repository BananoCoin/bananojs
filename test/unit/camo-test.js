'use strict';

// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

const seed0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';

describe('camo', () => {
  it('getCamoPublicKey account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedResponse= '80989F0ED4154E886AD926392DB1F9B524AB250A1BEEBA6C999A2F06C36F7E00';
    const actualResponse = await bananojs.getCamoPublicKey(privateKey0);
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  it('getSharedSecret account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const publicKey1 = await bananojs.getCamoPublicKey(privateKey1);
    const sharedSecret01 = await bananojs.getSharedSecret(privateKey0, publicKey1);
    const sharedSecret10 = await bananojs.getSharedSecret(privateKey1, publicKey0);
    expect(sharedSecret01).to.deep.equal(sharedSecret10);
  });
  it('receive account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const expectedResponse = [];
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    const actualResponse = await bananojs.camoReceive(privateKey0, publicKey0);
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  it('receive account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const publicKey1 = await bananojs.getCamoPublicKey(privateKey1);
    const expectedResponse = [];
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    const actualResponse = await bananojs.camoReceive(privateKey1, publicKey1);
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  it('camo account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const actualResponse = await bananojs.getCamoAccount(publicKey0);
    const expectedResponse = 'camo_316rmw9fa7cgj3ofkbjs7przmfb6oekin8zgqbpbm8jh1u3pyzi1ht7bh7e9';
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  it('camo sendWithdrawalFromSeed 1.011 valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const amountBananos = '1.011';
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const expectedResponse = [];
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    const actualResponse = await bananojs.camoSend(privateKey0, publicKey0, amountBananos);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('receive account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const expectedResponse = '1000000000000000000000000000000';
    const actualResponse = await bananojs.getCamoAccountBalanceRaw(privateKey0, publicKey0);
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  it('get next recieve account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const actualResponse = await bananojs.camoGetNextPrivateKeyForReceive(seed0);
    const expectedResponse = 'B73B723BF7BD042B66AD3332718BA98DE7312F95ED3D05A130C9204552A7AFFF';
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  it('camo sendWithdrawalFromSeed 1.01 valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const amountBananos = '1.01';
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const expectedResponse = [];
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    const actualResponse = await bananojs.camoSend(privateKey0, publicKey0, amountBananos);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('camo sendWithdrawalFromSeed 1 valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const amountBananos = '1';
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const expectedResponse = [];
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    const actualResponse = await bananojs.camoSend(privateKey0, publicKey0, amountBananos);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('camo sendWithdrawalFromSeed 5 valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const amountBananos = '5';
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const expectedResponse = [];
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    const actualResponse = await bananojs.camoSend(privateKey0, publicKey0, amountBananos);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('camo camoSendWithdrawalFromSeed 1 valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const amountBananos = '1';
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
    const expectedResponse = [];
    expectedResponse.push('000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F');
    const actualResponse = await bananojs.camoSendWithdrawalFromSeed(seed0, 0, camoAccount0, amountBananos);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('getAccountPublicKey camo', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const amountBananos = '1';
    const invalidCamoAccount = 'camo_21111111111111111111111111111111111111111111111111111111111';
    const message = `Invalid CAMO BANANO Account prefix \'${invalidCamoAccount}\'`;
    await testUtil.expectErrorMessage(message, bananojs.camoSendWithdrawalFromSeed,
        seed0, 0, invalidCamoAccount, amountBananos);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
