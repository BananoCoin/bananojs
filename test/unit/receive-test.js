'use strict';

// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');
const coinDatas = testUtil.getCoinDatas(bananoTest);

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;

describe('recieve', () => {
  coinDatas.forEach((coinData) => {
    const representative1 = coinData.representative1;
    it(coinData.coin + ' receiveDepositsForSeed valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();

      const expectedResponse= {};
      expectedResponse.pendingCount = 2;
      expectedResponse.pendingMessage = 'pending 2 blocks, of max 10.';
      expectedResponse.pendingBlocks = [
        '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
        '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
      ];
      expectedResponse.receiveCount = 1;
      expectedResponse.receiveCount = 2;
      expectedResponse.receiveMessage = 'received 2 blocks.';
      expectedResponse.receiveBlocks = [
        'F275F2D9D82EF524C4AAA0FC53F44B01704A8C8C65112B994346B20540B60642',
        'D0E578256728EBD0E1F09AD21D1116641D24B80B4308705831D82AC571DD5AFD',
      ];
      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      const actualResponse = await receiveDepositsForSeed(seed0, seedIx, representative1);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receiveDepositsForSeed no history, with no specific pending hash', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();

      const expectedResponse= {};
      expectedResponse.pendingCount = 2;
      expectedResponse.pendingMessage = 'pending 2 blocks, of max 10.';
      expectedResponse.pendingBlocks = [
        '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
        '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
      ];
      expectedResponse.receiveCount = 2;
      expectedResponse.receiveMessage = 'received 2 blocks.';

      const receiveBlocks = {
        banano: [
          '8884B8697327CCE0C086AD9DCDCDCED0892F57A42FD5647F9A80F399A4FD42C0',
          '7E71895E58F9966477DE64DE292A9A4145A33414953CFB242F2D1C625F7621DC',
        ],
        nano: [
          'FF3C7140192141665DB81316C37E2D48AE4813FB372761E24E061EDEF20036CD',
          'BD14E84252B8DCF188F6DB8D2ECD3C02F3BA31E0F6A373213A181C706C64CA34',
        ],
      };
      expectedResponse.receiveBlocks = receiveBlocks[coinData.coin];

      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      const actualResponse = await receiveDepositsForSeed(seed0, seedIx+1, representative1);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receiveDepositsForSeed valid account matches expected with specific pending hash', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const specificPendingHash = '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D';

      const expectedResponse= {};
      expectedResponse.pendingCount = 2;
      expectedResponse.pendingMessage = 'pending 2 blocks, of max 10.';
      expectedResponse.pendingBlocks = [
        '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
        '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
      ];
      expectedResponse.receiveCount = 1;
      expectedResponse.receiveCount = 1;
      expectedResponse.receiveMessage = 'received 1 blocks.';
      expectedResponse.receiveBlocks = [
        'D0E578256728EBD0E1F09AD21D1116641D24B80B4308705831D82AC571DD5AFD',
      ];

      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      const actualResponse = await receiveDepositsForSeed(seed0, seedIx, representative1, specificPendingHash);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receiveDepositsForSeed no history with specific pending hash', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const specificPendingHash = '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D';

      const expectedResponse= {};
      expectedResponse.pendingCount = 2;
      expectedResponse.pendingMessage = 'pending 2 blocks, of max 10.';
      expectedResponse.pendingBlocks = [
        '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
        '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
      ];
      expectedResponse.receiveCount = 1;
      expectedResponse.receiveMessage = 'received 1 blocks.';

      const receiveBlocks = {
        banano: [
          'CA8EC3E77834034E51332AA43EAF14B2D5A2D3A9CF127F1B99BF2AF84BFAF4C0',
        ],
        nano: [
          'BD14E84252B8DCF188F6DB8D2ECD3C02F3BA31E0F6A373213A181C706C64CA34',
        ],
      };
      expectedResponse.receiveBlocks = receiveBlocks[coinData.coin];

      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      const actualResponse = await receiveDepositsForSeed(seed0, seedIx+1, representative1, specificPendingHash);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receiveDepositsForSeed errors', async () => {
      const bananojs = testUtil.getBananojsWithErrorApi();

      const messages = {
        banano: 'getAccountsPending accounts:ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7 count:10',
        nano: 'getAccountsPending accounts:nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7 count:10',
      };
      const message = messages[coinData.coin];
      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, receiveDepositsForSeed, seed0, seedIx, representative1);
    });
    it(coinData.coin + ' receiveDepositsForSeed processing error', async () => {
      const bananojs = testUtil.getBananojsWithProcessErrorApi();
      const message = '"process block:F275F2D9D82EF524C4AAA0FC53F44B01704A8C8C65112B994346B20540B60642"';
      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, receiveDepositsForSeed, seed0, seedIx, representative1);
    });
    it(coinData.coin + ' receiveDepositsForSeed process fork', async () => {
      const bananojs = testUtil.getBananojsWithProcessForkApi();
      const message = '{"error":"Fork"}';
      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, receiveDepositsForSeed, seed0, seedIx, representative1);
    });
    it(coinData.coin + ' receiveDepositsForSeed pending error', async () => {
      const bananojs = testUtil.getBananojsWithPendingErrorApi();
      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      const actualResponse = await receiveDepositsForSeed(seed0, seedIx, representative1);

      const expectedResponse= {};
      expectedResponse.pendingCount = 0;
      expectedResponse.pendingMessage = 'pending unknown blocks, of max 10.';
      expectedResponse.pendingBlocks = [
      ];
      expectedResponse.receiveCount = 0;
      expectedResponse.receiveMessage = '';
      expectedResponse.receiveBlocks = [
      ];
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receiveDepositsForSeed valid account matches expected with no pending', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();

      const expectedResponse= {};
      expectedResponse.pendingCount = 0;
      expectedResponse.pendingMessage = 'pending 0 blocks, of max 10.';
      expectedResponse.pendingBlocks = [
      ];
      expectedResponse.receiveCount = 0;
      expectedResponse.receiveMessage = '';
      expectedResponse.receiveBlocks = [
      ];

      const receiveDepositsForSeed = coinData.getReceiveDepositsForSeedFn(bananojs);
      const actualResponse = await receiveDepositsForSeed(seed0, 2, representative1);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
