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
const pendingBlockHash = bananoTest.pendingBlockHash;
const pendingValueRaw = bananoTest.pendingValueRaw;

describe('open', () => {
  it('openAccountFromSeed valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedResponse= '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
    const actualResponse = await bananojs.openAccountFromSeed(seed0, seedIx, representative1, pendingBlockHash, pendingValueRaw);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('openAccountFromSeed error', async () => {
    const bananojs = testUtil.getBananojsWithErrorApi();
    const message = 'getGeneratedWork hash:C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B';
    testUtil.expectErrorMessage(message, bananojs.openAccountFromSeed, seed0, seedIx, representative1, pendingBlockHash, pendingValueRaw);
  });
  it('openAccountFromSeed processing error', async () => {
    const bananojs = testUtil.getBananojsWithProcessErrorApi();
    const message = 'process block:[object Object]';
    testUtil.expectErrorMessage(message, bananojs.openAccountFromSeed, seed0, seedIx, representative1, pendingBlockHash, pendingValueRaw);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
