// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

const privateKey0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';

describe('camo', () => {
  it('getCamoPublicKey account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const expectedResponse= '80989F0ED4154E886AD926392DB1F9B524AB250A1BEEBA6C999A2F06C36F7E00';
    const actualResponse = await bananojs.getCamoPublicKey(privateKey0);
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
  it('getSharedSecret account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithMockApi();
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const publicKey1 = await bananojs.getCamoPublicKey(privateKey1);
    const sharedSecret01 = await bananojs.getSharedSecret(privateKey0, publicKey1);
    const sharedSecret10 = await bananojs.getSharedSecret(privateKey1, publicKey0);
    expect(sharedSecret01).to.deep.equal(sharedSecret10);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
