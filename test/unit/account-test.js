'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const expectedBananoAccount = bananoTest.seed0bananoAccount;
const expectedNanoAccount = bananoTest.seed0nanoAccount;

describe('account', () => {
  it('getBananoAccountFromSeed valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const actualAccount = await bananojs.getBananoAccountFromSeed(seed0, seedIx);
    expect(actualAccount).to.equal(expectedBananoAccount);
  });
  it('getNanoAccountFromSeed valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const actualAccount = await bananojs.getNanoAccountFromSeed(seed0, seedIx);
    expect(actualAccount).to.equal(expectedNanoAccount);
  });
  it('banano getAccountBalanceRaw valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getBananoAccountFromSeed(seed0, seedIx);
    const actualBalance = await bananojs.getAccountBalanceRaw(account);
    const expectedBalance = '1000000000000000000000000000000';
    expect(actualBalance).to.equal(expectedBalance);
  });
  it('banano getAccountBalanceAndPendingRaw valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getBananoAccountFromSeed(seed0, seedIx);
    const balances = await bananojs.getAccountBalanceAndPendingRaw(account);
    const actualBalance = balances.balance;
    const actualPending = balances.pending;
    const expectedBalance = '1000000000000000000000000000000';
    expect(actualBalance).to.equal(expectedBalance);
    const expectedPending = '000123000456000789000000000000';
    expect(actualPending).to.equal(expectedPending);
  });
  it('nano getAccountBalanceRaw valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getNanoAccountFromSeed(seed0, seedIx);
    const actualBalance = await bananojs.getAccountBalanceRaw(account);
    const expectedBalance = '10000000000000000000000000000000';
    expect(actualBalance).to.equal(expectedBalance);
  });
  it('banano getAccountHistory valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getBananoAccountFromSeed(seed0, seedIx);
    const actualHistory = await bananojs.getAccountHistory(account, -1, false, false);
    const expectedHistory = {
      'account': 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
      'history': [
        {
          'account': 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
          'hash': '80392607E85E73CC3E94B4126F24488EBDFEB174944B890C97E8F36D89591DC5',
          'height': '60',
          'local_timestamp': '1551532723',
          'type': 'send',
        },
      ],
      'previous': '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72',
    };
    expect(actualHistory).to.deep.equal(expectedHistory);
  });
  it('nano getAccountHistory valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getNanoAccountFromSeed(seed0, seedIx);
    const actualHistory = await bananojs.getAccountHistory(account, -1, false, false);
    const expectedHistory = {
      'account': 'nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
      'history': [
        {
          'account': 'nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
          'hash': '80392607E85E73CC3E94B4126F24488EBDFEB174944B890C97E8F36D89591DC5',
          'height': '60',
          'local_timestamp': '1551532723',
          'type': 'send',
        },
      ],
      'previous': '8D3AB98B301224253750D448B4BD997132400CEDD0A8432F775724F2D9821C72',
    };
    expect(actualHistory).to.deep.equal(expectedHistory);
  });
  it('banano getAccountInfo valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getBananoAccountFromSeed(seed0, seedIx);
    const actualAccountInfo = await bananojs.getAccountInfo(account);
    const expectedAccountInfo = {
      'account_version': '1',
      'balance': '1000000000000000000000000000000',
      'block_count': '33',
      'confirmation_height': '28',
      'frontier': '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      'modified_timestamp': '1501793775',
      'open_block': '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
      'representative_block': '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
    };
    expect(actualAccountInfo).to.deep.equal(expectedAccountInfo);
  });
  it('nano getAccountInfo valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getNanoAccountFromSeed(seed0, seedIx);
    const actualAccountInfo = await bananojs.getAccountInfo(account);
    const expectedAccountInfo = {
      'account_version': '1',
      'balance': '10000000000000000000000000000000',
      'block_count': '33',
      'confirmation_height': '28',
      'frontier': '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      'modified_timestamp': '1501793775',
      'open_block': '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
      'representative_block': '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
    };
    expect(actualAccountInfo).to.deep.equal(expectedAccountInfo);
  });
  it('banano getAccountsPending valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getBananoAccountFromSeed(seed0, seedIx);
    const actualAccountInfo = await bananojs.getAccountsPending([account], 1);
    const expectedAccountInfo = {
      'blocks': {
        'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7': {
          '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 1,
          '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 2,
        },
      },
    };
    expect(actualAccountInfo).to.deep.equal(expectedAccountInfo);
  });
  it('nano getAccountsPending valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const account = await bananojs.getNanoAccountFromSeed(seed0, seedIx);
    const actualAccountInfo = await bananojs.getAccountsPending([account], 1);
    const expectedAccountInfo = {
      'blocks': {
        'nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7': {
          '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 1,
          '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 2,
        },
      },
    };
    expect(actualAccountInfo).to.deep.equal(expectedAccountInfo);
  });

  it('setBananodeApiUrl matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    bananojs.setBananodeApiUrl('test');
  });


  it('banano getBananoPartsFromRaw', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const raw = '1203000000000000000000000000004';
    const actual = bananojs.getBananoPartsFromRaw(raw);
    const expected = {
      'majorName': 'banano',
      'minorName': 'banoshi',
      'banano': '12',
      'banoshi': '3',
      'raw': '4',
    };
    expect(actual).to.deep.equal(expected);
  });
  it('nano getNanoPartsFromRaw', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const raw = '12000003000000000000000000000004';
    const actual = bananojs.getNanoPartsFromRaw(raw);
    const expected = {
      'majorName': 'nano',
      'minorName': 'nanoshi',
      'nano': '12',
      'nanoshi': '3',
      'raw': '4',
    };
    expect(actual).to.deep.equal(expected);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
