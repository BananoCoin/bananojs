'use strict';

// libraries
const chai = require('chai');
const crypto = require('crypto');

// modules
const expect = chai.expect;

const ed25519Pkcs8DerPrefix = '302e020100300506032b657004220420';

const ed25519SubjectPublicKeyInfoDerPrefix = '302a300506032b6570032100';

const signAndVerify = (privateKeyObj, publicKeyObj, hash) => {
  const signature = crypto.sign(undefined, hash, privateKeyObj);
  const signatureHex = signature.toString('hex');
  const verified = crypto.verify(undefined, hash, publicKeyObj, Buffer.from(signatureHex, 'hex'));
  return verified;
};

const privateToDer = (privateKeyHex) => {
  const derHex = `${ed25519Pkcs8DerPrefix}${privateKeyHex}`;
  return Buffer.from(derHex, 'hex');
};

const publicToDer = (publicKeyHex) => {
  const derHex = `${ed25519SubjectPublicKeyInfoDerPrefix}${publicKeyHex}`;
  return Buffer.from(derHex, 'hex');
};

const publicKeyHexToObject = (publicKeyHex) => {
  const publicKeyObject = crypto.createPublicKey( {key: publicToDer(publicKeyHex), format: 'der', type: 'spki'} );
  return publicKeyObject;
};

const privateKeyHexToObject = (privateKeyHex) => {
  const privateKeyObject = crypto.createPrivateKey( {key: privateToDer(privateKeyHex), format: 'der', type: 'pkcs8'} );
  return privateKeyObject;
};

const privateKeyObjecToHex = (privateKeyObj) => {
  const privateKey = privateKeyObj.export({type: 'pkcs8', format: 'der'}).toString('hex');
  expect(privateKey.length).to.equal(96);
  const privateKeyPrefix = privateKey.slice(0, ed25519Pkcs8DerPrefix.length);
  expect(privateKeyPrefix).to.equal(ed25519Pkcs8DerPrefix);
  const privateKeyHex = privateKey.slice(ed25519Pkcs8DerPrefix.length);
  expect(privateKeyHex.length).to.equal(64);
  return privateKeyHex;
};

const publicKeyObjecToHex = (publicKeyObj) => {
  const publicKey = publicKeyObj.export({type: 'spki', format: 'der'}).toString('hex');
  expect(publicKey.length).to.equal(88);
  const publicKeyPrefix = publicKey.slice(0, ed25519SubjectPublicKeyInfoDerPrefix.length);
  expect(publicKeyPrefix).to.equal(ed25519SubjectPublicKeyInfoDerPrefix);
  const publicKeyHex = publicKey.slice(ed25519SubjectPublicKeyInfoDerPrefix.length);
  expect(publicKeyHex.length).to.equal(64);
  return publicKeyHex;
};

const sumPoints = (hex0, hex1) => {
  const r0 = hex0.slice(0, 32);
  const s0 = hex0.slice(32);
  const r1 = hex1.slice(0, 32);
  const s1 = hex1.slice(32);
  const sumr = sumScalars(r0, r1);
  const sums = sumScalars(s0, s1);
  return sumr + sums;
};

const sumScalars = (hex0, hex1) => {
  const size = Math.max(hex0.length, hex1.length);
  const bi0 = BigInt('0x' + hex0);
  const bi1 = BigInt('0x' + hex1);
  const biSum = bi0 + bi1;
  let sumHex = biSum.toString(16);
  while (sumHex.length < size) {
    sumHex = '0' + sumHex;
  }
  return sumHex;
};

describe('split-key-crypto', () => {
  it('test ed25519 key', () => {
    const keyObject = crypto.generateKeyPairSync('ed25519', {privateKeyEncoding: {type: 'pkcs8', format: 'der'}, namedCurve: 'ed25519'});
    const privateKey = keyObject.privateKey.toString('hex');
    expect(privateKey.length).to.equal(96);
    const privateKeyPrefix = privateKey.slice(0, ed25519Pkcs8DerPrefix.length);
    expect(privateKeyPrefix).to.equal(ed25519Pkcs8DerPrefix);
    const privateKeyHex = privateKey.slice(ed25519Pkcs8DerPrefix.length);
    expect(privateKeyHex.length).to.equal(64);
  }),
  it('test split key', () => {
    const privateKey0 = '1111111111111111111111111111111111111111111111111111111111111112';
    const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';

    const privateKeyObj0 = privateKeyHexToObject(privateKey0);
    expect(privateKey0).to.deep.equal(privateKeyObjecToHex(privateKeyObj0));
    // console.log('privateKeyObj0', privateKeyObjecToHex(privateKeyObj0));
    const privateKeyObj1 = privateKeyHexToObject(privateKey1);
    expect(privateKey1).to.deep.equal(privateKeyObjecToHex(privateKeyObj1));
    // console.log('privateKeyObj1', privateKeyObjecToHex(privateKeyObj1));

    const publicKeyObj0 = crypto.createPublicKey(privateKeyObj0);
    const publicKeyObjHex0 = publicKeyObjecToHex(publicKeyObj0);
    // console.log('publicKeyObj0', publicKeyObjHex0.length, publicKeyObjHex0);

    const publicKeyObj1 = crypto.createPublicKey(privateKeyObj1);
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
    const privateKeyObj2Public = crypto.createPublicKey(privateKeyObj2);
    const privateKeyObj2PublicHex = publicKeyObjecToHex(privateKeyObj2Public);
    expect('a1375ca1346cb026f69d635bed64cabb95feda5469fe6a6d0465d12e1bf48e8f').to.deep.equal(privateKeyObj2PublicHex);
    // console.log('privateKeyObj2Public', privateKeyObj2PublicHex.length, privateKeyObj2PublicHex);

    const publicKey2 = sumPoints(publicKeyObjHex0, publicKeyObjHex1);
    // console.log('publicKey2----------', publicKey2.length, publicKey2);
    const publicKeyObj2 = publicKeyHexToObject(publicKey2);
    const publicKeyObjHex2 = publicKeyObjecToHex(publicKeyObj2);
    expect('10b243c2250019d79adf298654d696aaf1603e806a386cf2ec2014f2e2ee877b').to.deep.equal(publicKeyObjHex2);
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
