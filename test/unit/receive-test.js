// const assert = require('chai').assert;
const expect = require('chai').expect;

const bananoTest = require('./banano-test.json');

const bananojs = require('../util/test-util.js').getBananojsWithMockApi();

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const representative1 = bananoTest.representative1;

describe('recieve', () => {
  it('receiveDepositsForSeed valid account matches expected', async () => {
    const expectedResponse= {};
    expectedResponse.pendingCount = 1;
    expectedResponse.pendingMessage = 'pending 1 blocks, of max 10.';
    expectedResponse.receiveCount = 1;
    expectedResponse.receiveMessage = 'received 1 blocks.';

    const actualResponse = await bananojs.receiveDepositsForSeed(seed0, seedIx, representative1);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
});
