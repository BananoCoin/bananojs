'use strict';

// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

describe('account', () => {
  it('getAccountFromSeed error zeros-and-blanks', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const seed = '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 00';
    const message = `Invalid BANANO seed '${seed}', does not match regex '^[0123456789abcdefABCDEF]{64}$'`;
    await testUtil.expectErrorMessage(message, bananojs.getAccountFromSeed, seed, 0);
  });
  it('getAccountFromSeed error r0n0om0r0p', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const seed = 'r0n0om0r0p000000r0n0om0r0p000000r0n0om0r0p000000r0n0om0r0p000000';
    const message = `Invalid BANANO seed '${seed}', does not match regex '^[0123456789abcdefABCDEF]{64}$'`;
    await testUtil.expectErrorMessage(message, bananojs.getAccountFromSeed, seed, 0);
  });
  it('getAccountFromSeed error randomcrap123456', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const seed = 'randomcrap123456randomcrap123456randomcrap123456randomcrap123456';
    const message = `Invalid BANANO seed '${seed}', does not match regex '^[0123456789abcdefABCDEF]{64}$'`;
    await testUtil.expectErrorMessage(message, bananojs.getAccountFromSeed, seed, 0);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
