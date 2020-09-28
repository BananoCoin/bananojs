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
    // console.log('verify0', verify0);
    const verify1 = signAndVerify(privateKey1, publicKey1, message);
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
