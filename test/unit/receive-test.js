'use strict';

// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const representative1 = bananoTest.representative1;

describe('recieve', () => {
  it('receiveDepositsForSeed valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();

    const expectedResponse= {};
    expectedResponse.pendingCount = 2;
    expectedResponse.pendingMessage = 'pending 2 blocks, of max 10.';
    expectedResponse.receiveCount = 2;
    expectedResponse.receiveMessage = 'received 2 blocks.';

    const actualResponse = await bananojs.receiveDepositsForSeed(seed0, seedIx, representative1);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('receiveDepositsForSeed no history', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();

    const expectedResponse= {};
    expectedResponse.pendingCount = 2;
    expectedResponse.pendingMessage = 'pending 2 blocks, of max 10.';
    expectedResponse.receiveCount = 2;
    expectedResponse.receiveMessage = 'received 2 blocks.';

    const actualResponse = await bananojs.receiveDepositsForSeed(seed0, seedIx+1, representative1);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('receiveDepositsForSeed valid account matches expected with specific pending hash', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const specificPendingHash = '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D';

    const expectedResponse= {};
    expectedResponse.pendingCount = 2;
    expectedResponse.pendingMessage = 'pending 2 blocks, of max 10.';
    expectedResponse.receiveCount = 1;
    expectedResponse.receiveMessage = 'received 1 blocks.';

    const actualResponse = await bananojs.receiveDepositsForSeed(seed0, seedIx, representative1, specificPendingHash);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('receiveDepositsForSeed errors', async () => {
    const bananojs = testUtil.getBananojsWithErrorApi();
    const message = 'getAccountsPending accounts:ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7 count:10';
    await testUtil.expectErrorMessage(message, bananojs.receiveDepositsForSeed, seed0, seedIx, representative1);
  });
  it('receiveDepositsForSeed processing error', async () => {
    const bananojs = testUtil.getBananojsWithProcessErrorApi();
    const message = 'process block:F275F2D9D82EF524C4AAA0FC53F44B01704A8C8C65112B994346B20540B60642';
    await testUtil.expectErrorMessage(message, bananojs.receiveDepositsForSeed, seed0, seedIx, representative1);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
