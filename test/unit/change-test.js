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
  it('changeRepresentativeForSeed valid account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedResponse= '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
    const actualResponse = await bananojs.changeRepresentativeForSeed(seed0, seedIx, representative1);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('changeRepresentativeForSeed error', async () => {
    const bananojs = testUtil.getBananojsWithErrorApi();
    const message = 'getAccountInfo account:ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7';
    testUtil.expectErrorMessage(message, bananojs.changeRepresentativeForSeed, seed0, seedIx, representative1);
  });
  it('changeRepresentativeForSeed processing error', async () => {
    const bananojs = testUtil.getBananojsWithProcessErrorApi();
    const message = 'process block:[object Object]';
    testUtil.expectErrorMessage(message, bananojs.changeRepresentativeForSeed, seed0, seedIx, representative1);
  });
});
