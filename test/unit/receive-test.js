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
    expectedResponse.pendingCount = 1;
    expectedResponse.pendingMessage = 'pending 1 blocks, of max 10.';
    expectedResponse.receiveCount = 1;
    expectedResponse.receiveMessage = 'received 1 blocks.';

    const actualResponse = await bananojs.receiveDepositsForSeed(seed0, seedIx, representative1);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('receiveDepositsForSeed errors', async () => {
    const bananojs = testUtil.getBananojsWithErrorApi();
    const message = 'getAccountsPending accounts:ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7 count:10';
    testUtil.expectErrorMessage(message, bananojs.receiveDepositsForSeed, seed0, seedIx, representative1);
  });
  it('receiveDepositsForSeed processing error', async () => {
    const bananojs = testUtil.getBananojsWithProcessErrorApi();
    const message = 'process block:[object Object]';
    testUtil.expectErrorMessage(message, bananojs.receiveDepositsForSeed, seed0, seedIx, representative1);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
