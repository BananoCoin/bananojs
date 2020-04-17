'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const invalidBanAccount = 'ban_111111111111111111111111111111111111111111111111111111111112';

const invalidNanoAccount = 'nano_211111111111111111111111111111111111111111111111111111111111';

const invalidCamoAccount = 'camo_21111111111111111111111111111111111111111111111111111111111';

describe('corner-cases', () => {
  it('decToHex matches expected', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = '01';
    const actual = bananojs.bananoUtil.decToHex(1);
    expect(expected).to.deep.equal(actual);
  });
  it('getAccountPublicKey error Undefined BANANO Account', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const message = 'Undefined BANANO Account';
    await testUtil.expectErrorMessage(message, bananojs.getAccountPublicKey);
  });
  it('getAccountPublicKey error Invalid BANANO Account prefix', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const message = 'Invalid BANANO Account prefix \'\'';
    await testUtil.expectErrorMessage(message, bananojs.getAccountPublicKey, '');
  });
  it('getAccountPublicKey error Invalid BANANO Account', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const message = `Invalid BANANO Account \'${invalidBanAccount}\', does not match regex '^[13456789abcdefghijkmnopqrstuwxyz]+$'`;
    await testUtil.expectErrorMessage(message, bananojs.getAccountPublicKey,
        invalidBanAccount);
  });
  it('getAccountPublicKey error Invalid NANO Account', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const message = `Invalid NANO Account prefix \'${invalidNanoAccount}\'`;
    await testUtil.expectErrorMessage(message, bananojs.getAccountPublicKey,
        invalidNanoAccount);
  });
  it('getAccountPublicKey error Invalid CAMO BANANO Account prefix', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const message = `Invalid CAMO BANANO Account prefix \'${invalidCamoAccount}\'`;
    await testUtil.expectErrorMessage(message, bananojs.getAccountPublicKey,
        invalidCamoAccount);
  });
  it('getAccountPublicKey camo', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = bananoTest.accountPublicKey;
    const actual = bananojs.getAccountPublicKey(bananoTest.camoAccount);
    expect(expected).to.deep.equal(actual);
  });
  it('getRawStrFromBanoshiStr matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = '1000000000000000000000000000';
    const actual = bananojs.getRawStrFromBanoshiStr(1);
    expect(expected).to.deep.equal(actual);
  });
  it('getRawStrFromNanoshiStr matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = '1000000000000000000000000000';
    const actual = bananojs.getRawStrFromNanoshiStr(1);
    expect(expected).to.deep.equal(actual);
  });
  it('getBlockCount matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = {'count': '1000', 'unchecked': '10'};
    const actual = await bananojs.getBlockCount();
    expect(expected).to.deep.equal(actual);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
