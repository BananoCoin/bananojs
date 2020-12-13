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

describe('send', () => {
  coinDatas.forEach((coinData) => {
    const bananoAccount = coinData.toAccount;
    it(coinData.coin + ' sendAmountToAccount with blank previous', async () => {
      const expectedResponse = undefined;
      const bananojs = testUtil.getBananojsWithMockApi();
      const sendAmountToAccountWithRepresentativeAndPrevious = coinData.getSendAmountToAccountWithRepresentativeAndPreviousFn(bananojs);
      const actualResponse = await sendAmountToAccountWithRepresentativeAndPrevious(
          seed0, seedIx, bananoAccount, 1,
          '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
          '');
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' sendAmountToAccount valid account matches expected', (done) => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const successCallback = () => {
        done();
      };
      const failureCallback = (error) => {
        throw error;
      };
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      sendAmountToAccount(seed0, seedIx, bananoAccount, 1, successCallback, failureCallback);
    });
    it(coinData.coin + ' sendAmountToAccount error', async () => {
      const bananojs = testUtil.getBananojsWithErrorApi();
      const successCallback = () => {
        throw new Error('successCallback should not be called');
      };
      const failureCallback = (error) => {
        throw error;
      };
      const messages = {
        banano: 'Error: getAccountInfo account:ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
        nano: 'Error: getAccountInfo account:nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
      };
      const message = messages[coinData.coin];
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      await testUtil.expectErrorMessage(message, sendAmountToAccount, seed0, seedIx, bananoAccount, 1, successCallback, failureCallback);
    });
    it(coinData.coin + ' sendAmountToAccount processing error', async () => {
      const bananojs = testUtil.getBananojsWithProcessErrorApi();
      const successCallback = () => {
        throw new Error('successCallback should not be called');
      };
      const failureCallback = (error) => {
        throw error;
      };
      let message;
      if (coinData.coin == 'banano') {
        message = 'Error: process block:9B4B70A4BE903A07C549D3AD16EDA268D61F572210B1E63B93F6827CB4944CF6';
      }
      if (coinData.coin == 'nano') {
        message = 'Error: process block:6FCC35455754EB4A5C39A64A97312A29257064397E817A332C83D1C8687C1AFC';
      }
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      await testUtil.expectErrorMessage(message, sendAmountToAccount, seed0, seedIx, bananoAccount, 1, successCallback, failureCallback);
    });
    it(coinData.coin + ' sendAmountToAccount low balance error', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const successCallback = () => {
        throw new Error('successCallback should not be called');
      };
      const failureCallback = (error) => {
        throw error;
      };
      let message;
      let amountRaw;
      if (coinData.coin == 'banano') {
        amountRaw = bananojs.getRawStrFromBananoStr('11');
        message = 'Error: The server\'s account balance of 10 ' + coinData.coin + 's is too small, cannot withdraw 11 ' + coinData.coin + 's. In raw 1000000000000000000000000000000 < 1100000000000000000000000000000.';
      }
      if (coinData.coin == 'nano') {
        amountRaw = bananojs.getRawStrFromNanoStr('11');
        message = 'Error: The server\'s account balance of 10 ' + coinData.coin + 's is too small, cannot withdraw 11 ' + coinData.coin + 's. In raw 10000000000000000000000000000000 < 11000000000000000000000000000000.';
      }
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      await testUtil.expectErrorMessage(message, sendAmountToAccount, seed0, seedIx, bananoAccount, amountRaw, successCallback, failureCallback);
    });
    it(coinData.coin + ' sendAmountToAccount undefined account info balance error', async () => {
      const bananojs = testUtil.getBananojsWithAccountInfoBalanceErrorApi();
      const successCallback = () => {
        throw new Error('successCallback should not be called');
      };
      const failureCallback = (error) => {
        throw error;
      };
      const message = 'Error: The server\'s account balance cannot be retrieved, please try again.';
      const amountRaw = bananojs.getRawStrFromBananoStr('11');
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      await testUtil.expectErrorMessage(message, sendAmountToAccount, seed0, seedIx, bananoAccount, amountRaw, successCallback, failureCallback);
    });
    it(coinData.coin + ' sendAmountToAccount undefined account info error', async () => {
      const bananojs = testUtil.getBananojsWithAccountInfoErrorApi();
      const successCallback = () => {
        throw new Error('successCallback should not be called');
      };
      const failureCallback = (error) => {
        throw error;
      };
      const message = 'Error: The server\'s account info cannot be retrieved, please try again.';
      const amountRaw = bananojs.getRawStrFromBananoStr('11');
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(bananojs);
      await testUtil.expectErrorMessage(message, sendAmountToAccount, seed0, seedIx, bananoAccount, amountRaw, successCallback, failureCallback);
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
