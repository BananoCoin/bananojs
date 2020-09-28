'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

const bananojs = testUtil.getBananojsWithCamoApi();

const signAndVerify = (privateKey, publicKey, hash) => {
  const signature = bananojs.signHash(privateKey, hash);
  const verified = bananojs.verify(hash, signature, publicKey);
  return verified;
};

describe('split-key-camo', () => {
  it('test split key', () => {
    const privateKey0 = '1111111111111111111111111111111111111111111111111111111111111112';
    const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';

    // console.log('privateKey0', privateKey0);
    // console.log('privateKey1', privateKey1);

    const publicKey0 = bananojs.getCamoPublicKey(privateKey0);
    // console.log('publicKey0', publicKey0.length, publicKey0);

    const publicKey1 = bananojs.getCamoPublicKey(privateKey1);
    // console.log('publicKey1', publicKey1.length, publicKey1);

    const message = Buffer.from('00', 'hex');
    const verify0 = signAndVerify(privateKey0, publicKey0, message);
    expect(false).to.deep.equal(verify0);
    // console.log('verify0', verify0);
    const verify1 = signAndVerify(privateKey1, publicKey1, message);
    expect(false).to.deep.equal(verify1);
    // console.log('verify1', verify1);

    // const privateKey2 = sumScalars(privateKey0, privateKey1);
    // console.log('privateKey2', privateKey2.length, privateKey2);
    // const privateKeyObj2 = privateKeyHexToObject(privateKey2);
    // console.log('privateKeyObj2', privateKeyObjecToHex(privateKeyObj2));
    // const privateKeyObj2Public = crypto.createPublicKey(privateKeyObj2);
    // const privateKeyObj2PublicHex = publicKeyObjecToHex(privateKeyObj2Public);
    // console.log('privateKeyObj2Public', privateKeyObj2PublicHex.length, privateKeyObj2PublicHex);
    //
    // const publicKey2 = sumPoints(publicKeyObjHex0, publicKeyObjHex1);
    // console.log('publicKey2----------', publicKey2.length, publicKey2);
    // const publicKeyObj2 = publicKeyHexToObject(publicKey2);
    // const publicKeyObjHex2 = publicKeyObjecToHex(publicKeyObj2);
    // console.log('publicKeyObj2-------', publicKeyObjHex2.length, publicKeyObjHex2);
    //
    // const verify2 = signAndVerify(privateKeyObj2, publicKeyObj2, message);
    // console.log('verify2', verify2);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});
// based on https://bitcointalk.org/index.php?topic=81865.msg901491#msg901491
