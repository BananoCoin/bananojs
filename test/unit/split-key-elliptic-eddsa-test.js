'use strict';

// libraries
const chai = require('chai');
const EdDSA = require('elliptic').eddsa;
const ed25519 = new EdDSA('ed25519');

// modules
const expect = chai.expect;

const ed25519_pkcs8_der_prefix = '302e020100300506032b657004220420';

const ed25519_SubjectPublicKeyInfo_der_prefix = '302a300506032b6570032100';

const signAndVerify = (privateKeyObj, publicKeyObj, hash) => {
  const signature = privateKeyObj.sign(hash);
  const signatureHex = signature.toString('hex');
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
    // console.log('verify0', verify0);
    const verify1 = signAndVerify(privateKeyObj1, publicKeyObj1, message);
    // console.log('verify1', verify1);

    const privateKey2 = sumScalars(privateKey0, privateKey1);
    // console.log('privateKey2', privateKey2.length, privateKey2);
    const privateKeyObj2 = privateKeyHexToObject(privateKey2);
    // console.log('privateKeyObj2', privateKeyObjecToHex(privateKeyObj2));
    const privateKeyObj2Public = publicKeyHexToObject(publicKeyHexFromPrivateKeyObj(privateKeyObj2));
    const privateKeyObj2PublicHex = publicKeyObjecToHex(privateKeyObj2Public);
    // console.log('privateKeyObj2Public', privateKeyObj2PublicHex.length, privateKeyObj2PublicHex);

    const publicKey2 = sumPoints(publicKeyObjHex0, publicKeyObjHex1);
    // console.log('publicKey2----------', publicKey2.length, publicKey2);
    const publicKeyObj2 = publicKeyHexToObject(publicKey2);
    const publicKeyObjHex2 = publicKeyObjecToHex(publicKeyObj2);
    // console.log('publicKeyObj2-------', publicKeyObjHex2.length, publicKeyObjHex2);

    const verify2 = signAndVerify(privateKeyObj2, publicKeyObj2, message);
    // console.log('verify2', verify2);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});
// based on https://bitcointalk.org/index.php?topic=81865.msg901491#msg901491
/*
It works like this:

1) You generate a random 256-bit integer less than the SECP256k1 generator. You keep this secret. (Effectively, an ECDSA private key.)

2) You compute the corresponding EC point on the SECP256k1 curve. You share this with whoever is finding the vanity address for you. (This is the ECDSA public key that corresponds to the private key you generated in step one.)

3) The person working out the vanity address for you tries various 256-bit integers also less than the SECP256k1 generator. They compute the corresponding EC point and add it to the EC point you sent them (from step two). They then hash this and see if it produces the desired vanity address. They repeat this over and over until they find a 256-bit integer that works. They give this integer to you. (And the world, it need not be kept secret.)

4) You add the 256-bit integer they found to the 256-bit integer you generated in step 1 and reduce it modulo the SECP256k1 generator.

5) You now have the private key, and they don't. (And you can prove that they cannot generate the private key from just the information you gave them unless ECDSA is fundamentally broken.)

In ECDSA, you convert a private key to a public key by multiplying by the generator. Division is impossible.

The vanity address generation scheme above works because: (A+B)*G = AG + BG

You generate A and AG, but give them only AG.

They try various different B's, calculating the AG+BG for each one to find the right one for the vanity address.

They give you B. You can now compute A+B (the secret key corresponding to the public key AG+BG) but nobody else can since they do not know A.

Computing A from AG would mean breaking ECDSA fundamentally. All you gave them is AG, an ECDSA public key. If they could figure out the private key to your new account (A+B), they could also figure out A. So if they could figure out the private key to your vanity account, they could also figure out the private key you created in step 1. But all you gave them was the corresponding public key. So any compromise of the vanity account would mean they could compromise a private key given only its corresponding public key.
*/
