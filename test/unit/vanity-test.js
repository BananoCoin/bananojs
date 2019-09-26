// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');
const bananojs = testUtil.getBananojsWithMockApi();

describe('vanity', () => {
  it('generateSplitKeyVanity account matches expected', () => {
    const clientPrivateKey = bananoTest.privateKey;
    const clientPublicKey = bananojs.getPublicKey(clientPrivateKey);
    const vanityRegex = 'ban_1c.*?';
    const vanityInfo = bananojs.generateSplitKeyVanity(clientPublicKey, vanityRegex);
    expect(vanityInfo).to.deep.equal({
      account: 'ban_1cr4mm7po9h9x3c6f5sxzfuartbpq9aqo7zobjp6p8yob4gawen6junsx8x1',
      privateKey: '00000000000000000000000000000000000000000000000000000000000000FF',
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
