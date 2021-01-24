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
  it('getAccountPublicKey error `Not a string', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const message = `Not a string: '[object Promise]'`;
    const promise = new Promise((resolve)=>{
      resolve();
    });
    await testUtil.expectErrorMessage(message, bananojs.getAccountPublicKey, promise );
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
    const expected = '1000000000000000000000000';
    const actual = bananojs.getRawStrFromNanoshiStr(1);
    expect(expected).to.deep.equal(actual);
  });
  it('getBananoAccount matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = 'ban_7rmwcs5x';
    const actual = bananojs.getBananoAccount('');
    expect(expected).to.deep.equal(actual);
  });
  it('getNanoAccount matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = 'nano_7rmwcs5x';
    const actual = bananojs.getNanoAccount('');
    expect(expected).to.deep.equal(actual);
  });
  it('getBlockCount matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expected = {'count': '1000', 'unchecked': '10'};
    const actual = await bananojs.getBlockCount();
    expect(expected).to.deep.equal(actual);
  });
  it('getBananoDecimalAmountAsRaw matches expected, full decimal', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const decimalAmount = '1.23456789012345678901234567890';
    const expectedRaw = '123456789012345678901234567890';
    const actualRaw = await bananojs.getBananoDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const bananoParts = await bananojs.getBananoPartsFromRaw(actualRaw);
    const actualDesc = await bananojs.getBananoPartsDescription(bananoParts);
    const expectedDesc = '1 banano 23 banoshi 456,789,012,345,678,901,234,567,890 raw';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getBananoDecimalAmountAsRaw matches expected, whole number', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const decimalAmount = '1234';
    const expectedRaw = '123400000000000000000000000000000';
    const actualRaw = await bananojs.getBananoDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const bananoParts = await bananojs.getBananoPartsFromRaw(actualRaw);
    const actualDesc = await bananojs.getBananoPartsDescription(bananoParts);
    const expectedDesc = '1,234 banano';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getBananoDecimalAmountAsRaw matches expected, banoshi only', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const decimalAmount = '0.12';
    const expectedRaw = '12000000000000000000000000000';
    const actualRaw = await bananojs.getBananoDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const bananoParts = await bananojs.getBananoPartsFromRaw(actualRaw);
    const actualDesc = await bananojs.getBananoPartsDescription(bananoParts);
    const expectedDesc = '12 banoshi';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getBananoDecimalAmountAsRaw matches expected, raw only', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const decimalAmount = '0.0012';
    const expectedRaw = '120000000000000000000000000';
    const actualRaw = await bananojs.getBananoDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const bananoParts = await bananojs.getBananoPartsFromRaw(actualRaw);
    const actualDesc = await bananojs.getBananoPartsDescription(bananoParts);
    const expectedDesc = '120,000,000,000,000,000,000,000,000 raw';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getBananoDecimalAmountAsRaw matches expected, zero', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const decimalAmount = '0';
    const expectedRaw = '0';
    const actualRaw = await bananojs.getBananoDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const bananoParts = await bananojs.getBananoPartsFromRaw(actualRaw);
    const actualDesc = await bananojs.getBananoPartsDescription(bananoParts);
    const expectedDesc = '0 banano';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getBananoDecimalAmountAsRaw matches expected error', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const decimalAmount = '1.234567890123456789012345678901';
    const message = 'too many numbers past the decimal in \'1.234567890123456789012345678901\', remove 1 of them.';
    await testUtil.expectErrorMessage(message, bananojs.getBananoDecimalAmountAsRaw,
        decimalAmount);
  });
  describe('getBananoPartsAsDecimal', () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    it('getBananoPartsAsDecimal matches expected, zero, banano,banoshi,raw', async () => {
      const actualBananoParts = await bananojs.getBananoPartsFromDecimal('0');
      expect(actualBananoParts.banano).to.equal('0');
      expect(actualBananoParts.banoshi).to.equal('0');
      expect(actualBananoParts.raw).to.equal('0');
      const actualDecimal = await bananojs.getBananoPartsAsDecimal(actualBananoParts);
      const expectedDecimal = '0.00000000000000000000000000000';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getBananoPartsAsDecimal matches expected, zero, raw only', async () => {
      const actualBananoParts = await bananojs.getBananoPartsFromDecimal('0');
      delete actualBananoParts.banano;
      delete actualBananoParts.banoshi;
      expect(actualBananoParts.banano).to.equal(undefined);
      expect(actualBananoParts.banoshi).to.equal(undefined);
      expect(actualBananoParts.raw).to.equal('0');
      const actualDecimal = await bananojs.getBananoPartsAsDecimal(actualBananoParts);
      const expectedDecimal = '0.00000000000000000000000000000';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getBananoPartsAsDecimal matches expected, zero, banoshi only', async () => {
      const actualBananoParts = await bananojs.getBananoPartsFromDecimal('0');
      delete actualBananoParts.banano;
      delete actualBananoParts.raw;
      expect(actualBananoParts.banano).to.equal(undefined);
      expect(actualBananoParts.banoshi).to.equal('0');
      expect(actualBananoParts.raw).to.equal(undefined);
      const actualDecimal = await bananojs.getBananoPartsAsDecimal(actualBananoParts);
      const expectedDecimal = '0.00';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getBananoPartsAsDecimal matches expected, zero, banano only', async () => {
      const actualBananoParts = await bananojs.getBananoPartsFromDecimal('0');
      delete actualBananoParts.banoshi;
      delete actualBananoParts.raw;
      expect(actualBananoParts.banano).to.equal('0');
      expect(actualBananoParts.banoshi).to.equal(undefined);
      expect(actualBananoParts.raw).to.equal(undefined);
      const actualDecimal = await bananojs.getBananoPartsAsDecimal(actualBananoParts);
      const expectedDecimal = '0';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getBananoPartsAsDecimal matches expected error', async () => {
      const actualDecimalAmount = '1.23456789012345678901234567890';
      const actualBananoParts = await bananojs.getBananoPartsFromDecimal(actualDecimalAmount);
      actualBananoParts.raw += '1';
      const message = 'too many numbers in bananoParts.raw \'4567890123456789012345678901\', remove 1 of them.';
      await testUtil.expectErrorMessage(message, bananojs.getBananoPartsAsDecimal,
          actualBananoParts);
    });
  });
  it('sign from hardware wallet', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const bananodeApi = require('../util/mock-bananode-api.js');
    // console.log(`STARTED hw`, bananojs.bananodeApi);
    const destAccount = 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7';
    const amountRaw = '1';
    const expected = 'EA94473875A88E3777C7FF4251410F09B82AACECE02901D78FDAE4BC571AF77D';
    const accountSigner = {};
    accountSigner.getPublicKey = async () => {
      return await bananojs.getPublicKey(destAccount);
    };
    accountSigner.signBlock = async () => {
      return '';
    };
    try {
      const actual = await bananojs.bananoUtil.sendFromPrivateKey(bananodeApi, accountSigner, destAccount, amountRaw, bananojs.BANANO_PREFIX);
      expect(expected).to.deep.equal(actual);
    } catch (e) {
      console.trace(e);
    }
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
