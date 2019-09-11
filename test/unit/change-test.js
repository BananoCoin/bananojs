// const assert = require('chai').assert;
const expect = require('chai').expect;

const bananoTest = require('./banano-test.json');

const bananojs = require('../util/test-util.js').getBananojsWithMockApi();

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const representative1 = bananoTest.representative1;

describe('recieve', () => {
  it('receiveDepositsForSeed valid account matches expected', async () => {
    const expectedResponse= '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';
    const actualResponse = await bananojs.changeRepresentativeForSeed(seed0, seedIx, representative1);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
});
