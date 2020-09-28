'use strict';

// libraries
const chai = require('chai');
const EdDSA = require('elliptic').eddsa;
const ed25519 = new EdDSA('ed25519');

// modules
const expect = chai.expect;

const signAndVerify = (privateKeyObj, publicKeyObj, hash) => {
  const signature = privateKeyObj.sign(hash);
  // const signatureHex = signature.toString('hex');
  const verified = publicKeyObj.verify(hash, signature);
  return verified;
};


const publicKeyHexToObject = (publicKeyHex) => {
  const publicKeyObject = ed25519.keyFromPublic(publicKeyHex, 'hex');
  return publicKeyObject;
};

const privateKeyHexToObject = (privateKeyHex) => {
  const privateKeyObject = ed25519.keyFromSecret(privateKeyHex, 'hex');
  return privateKeyObject;
};

const privateKeyObjecToHex = (privateKeyObj) => {
  const privateKey = Buffer.from(privateKeyObj.privBytes()).toString('hex');
  expect(privateKey.length).to.equal(64);
  return privateKey;
};

const publicKeyObjecToHex = (publicKeyObj) => {
  const publicKey = Buffer.from(publicKeyObj.pubBytes()).toString('hex');
  expect(publicKey.length).to.equal(64);
  return publicKey;
};

const sumPoints = (hex0, hex1) => {
  const publicKeyObj0 = ed25519.decodePoint(publicKeyHexToObject(hex0).pubBytes());
  const publicKeyObj1 = ed25519.decodePoint(publicKeyHexToObject(hex1).pubBytes());
  const publicKeyObjSum = publicKeyObj0.add(publicKeyObj1);
  const publicKeySum = ed25519.keyFromPublic(publicKeyObjSum);
  const hexsum = publicKeyObjecToHex(publicKeySum);
  return hexsum;
};

const sumScalars = (hex0, hex1) => {
  const size = Math.max(hex0.length, hex1.length);
  const privateKeyObject0 = privateKeyHexToObject(hex0);
  const privateKeyObject1 = privateKeyHexToObject(hex1);

  const bi0 = BigInt('0x' + privateKeyObjecToHex(privateKeyObject0));
  const bi1 = BigInt('0x' + privateKeyObjecToHex(privateKeyObject1));
  const biSum = bi0 + bi1;
  let sumHex = biSum.toString(16);
  while (sumHex.length < size) {
    sumHex = '0' + sumHex;
  }
  return sumHex;
};

const publicKeyHexFromPrivateKeyObj = (privateKeyObj) => {
  return Buffer.from(privateKeyObj.pubBytes()).toString('hex');
};

describe('split-key-eddsa', () => {
  it('test split key', () => {
    const privateKey0 = '1111111111111111111111111111111111111111111111111111111111111112';
    const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';

    const privateKeyObj0 = privateKeyHexToObject(privateKey0);
    // console.log('privateKeyObj0', privateKeyObjecToHex(privateKeyObj0));
    const privateKeyObj1 = privateKeyHexToObject(privateKey1);
    // console.log('privateKeyObj1', privateKeyObjecToHex(privateKeyObj1));

    const publicKeyObj0 = publicKeyHexToObject(publicKeyHexFromPrivateKeyObj(privateKeyObj0));
    const publicKeyObjHex0 = publicKeyObjecToHex(publicKeyObj0);
    // console.log('publicKeyObj0', publicKeyObjHex0.length, publicKeyObjHex0);

    const publicKeyObj1 = publicKeyHexToObject(publicKeyHexFromPrivateKeyObj(privateKeyObj1));
    const publicKeyObjHex1 = publicKeyObjecToHex(publicKeyObj1);
    // console.log('publicKeyObj1', publicKeyObjHex1.length, publicKeyObjHex1);

    const message = Buffer.from('00', 'hex');
    const verify0 = signAndVerify(privateKeyObj0, publicKeyObj0, message);
    expect(true).to.deep.equal(verify0);
    // console.log('verify0', verify0);
    const verify1 = signAndVerify(privateKeyObj1, publicKeyObj1, message);
    expect(true).to.deep.equal(verify1);
    // console.log('verify1', verify1);

    const privateKey2 = sumScalars(privateKey0, privateKey1);
    // console.log('privateKey2', privateKey2.length, privateKey2);
    const privateKeyObj2 = privateKeyHexToObject(privateKey2);
    // console.log('privateKeyObj2', privateKeyObjecToHex(privateKeyObj2));
    const privateKeyObj2Public = publicKeyHexToObject(publicKeyHexFromPrivateKeyObj(privateKeyObj2));
    const privateKeyObj2PublicHex = publicKeyObjecToHex(privateKeyObj2Public);
    expect('3882e9317ec78454bf4b38ed3fe8ab16242d1efe6913e04d1aa1daf819dececb').to.deep.equal(privateKeyObj2PublicHex);
    // console.log('privateKeyObj2Public', privateKeyObj2PublicHex.length, privateKeyObj2PublicHex);

    const publicKey2 = sumPoints(publicKeyObjHex0, publicKeyObjHex1);
    // console.log('publicKey2----------', publicKey2.length, publicKey2);
    const publicKeyObj2 = publicKeyHexToObject(publicKey2);
    const publicKeyObjHex2 = publicKeyObjecToHex(publicKeyObj2);
    expect('a18c5360a559e34f80a6896e1bcc23b596225842e6da93499e6b8ced719f467d').to.deep.equal(publicKeyObjHex2);
    // console.log('publicKeyObj2-------', publicKeyObjHex2.length, publicKeyObjHex2);

    const verify2 = signAndVerify(privateKeyObj2, publicKeyObj2, message);
    expect(false).to.deep.equal(verify2);
    // console.log('verify2', verify2);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});
// based on https://bitcointalk.org/index.php?topic=81865.msg901491#msg901491
