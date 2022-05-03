'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

describe('get-work', () => {
  it('getWork works', () => {
    const expectedWorkStart = 'A6B7F50000000000';
    const expectedWork = 'A6B7F60000000000';
    const expectedWorkHash =
      '2FA4DAA890EABA6A27415D70EEFF265B0744830421C406798C9B1E8B8E46258B';
    const bananojs = testUtil.getBananojsWithMockApi();
    const workBytes = bananojs.getBytesFromHex(expectedWorkStart).reverse();
    // const workBytes = bananojs.getZeroedWorkBytes();
    const actualWork = bananojs.getWorkUsingCpu(expectedWorkHash, workBytes);
    expect(expectedWork).to.deep.equal(actualWork);
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
