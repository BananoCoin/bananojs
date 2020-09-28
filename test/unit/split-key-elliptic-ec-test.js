'use strict';

// libraries
const chai = require('chai');
const elliptic = require('elliptic');
const EC = elliptic.ec;
// const curve25519 = new EC('secp256k1');
const curve25519 = new EC('curve25519');
// const ed25519 = new EC('ed25519');

// https://raw.githubusercontent.com/PlasmaPower/curve25519-repl/master/examples/nano/secure-distributed-vanity-address-gen.txt
// modules
const expect = chai.expect;

const signAndVerify = (privateKey, publicKey, hash) => {
  const privateKeyObj = curve25519.keyFromPrivate(privateKey, 'hex');
  const publicKeyObj = curve25519.keyFromPublic(publicKey, 'hex');
  // console.log('signAndVerify', 'privateKeyObj', privateKeyObj);
  // console.log('signAndVerify', 'publicKeyObj', publicKeyObj);

  const signature = privateKeyObj.sign(hash);
  const verified = publicKeyObj.verify(hash, signature);
  return verified;
};

const getECed25519Public = (privateKey) => {
  return curve25519.keyFromPrivate(privateKey, 'hex').getPublic();
};

const getECed25519PublicKey = (privateKey) => {
  return getECed25519Public(privateKey).encode('hex');
};

const sumPoints = (hex0, hex1) => {
  const publicKeyObj0 = getECed25519Public(hex0);
  const publicKeyObj1 = getECed25519Public(hex1);
  const publicKeyObjSum = publicKeyObj0.add(publicKeyObj1);
  const hexsum = publicKeyObjSum.encode('hex');
  return hexsum;
};

const sumScalars = (hex0, hex1) => {
  console.log('sumScalars', 'hex0', hex0);
  console.log('sumScalars', 'hex1', hex1);
  const privateKeySum = elliptic.utils.toHex(elliptic.utils.intFromLE(hex0).add(elliptic.utils.intFromLE(hex1)).umod(elliptic.curves.ed25519.n).toArray('le', 32));
  console.log('sumScalars', 'privateKeySum', privateKeySum);
  return privateKeySum;
};

describe('split-key-ec', () => {
  it('test sumScalars', () => {
    // const privateKey0 = 'fffa1da85206e1b977e4eaa21460bdf220856254607513409f3734d10d7c030d';
    // const privateKey1 = '2473C0360A3BAEDDB3154BE54BDC34C0D0AB6D1EC2DAF31E17BF7441B7EE3491';
    // const privateKey3 = 'cefa399a6fc5e97ea27681cd8c731bf7f030d0722250075fb6f6a812c56a380e';

    // console.log('privateKey0', privateKey0.length, privateKey0, BigInt('0x' + privateKey0));
    // console.log('privateKey1', privateKey1.length, privateKey1, BigInt('0x' + privateKey1));
    // const privateKey2 = sumScalars(privateKey0, privateKey1);
    // console.log('privateKey2', privateKey2.length, privateKey2, BigInt('0x' + privateKey2));
    // console.log('privateKey3', privateKey3.length, privateKey3, BigInt('0x' + privateKey3));
  }),
  it('test split key', () => {
    const privateKey0 = '1111111111111111111111111111111111111111111111111111111111111111';
    const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111112';
    // console.log('privateKey0', privateKey0);
    // console.log('privateKey1', privateKey1);

    const publicKey0 = getECed25519PublicKey(privateKey0);
    // console.log('publicKey0', publicKey0.length, publicKey0);

    const publicKey1 = getECed25519PublicKey(privateKey1);
    // console.log('publicKey1', publicKey1.length, publicKey1);

    // const message = Buffer.from('00', 'hex');
    // const verify0 = signAndVerify(privateKey0, publicKey0, message);
    // console.log('verify0', verify0);
    // const verify1 = signAndVerify(privateKey1, publicKey1, message);
    // console.log('verify1', verify1);
    //
    // const privateKey2 = sumScalars(privateKey0, privateKey1);
    // console.log('privateKey2', privateKey2.length, privateKey2);
    // const privateKey2public = getECed25519PublicKey(privateKey2);
    // console.log('privateKey2public', privateKey2public.length, privateKey2public);
    //
    // const publicKey2 = sumPoints(publicKey0, publicKey1);
    // console.log('publicKey2', publicKey2.length, publicKey2);
    //
    // const verify2 = signAndVerify(privateKey2, privateKey2public, message);
    // console.log('verify2', verify2);
    // const verify3 = signAndVerify(privateKey2, publicKey2, message);
    // console.log('verify3', verify3);
  }),

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
