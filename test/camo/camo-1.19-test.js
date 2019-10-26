'use strict';

// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

const privateKey0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';

const aliceAmount0 = BigInt(10);
const bobAmount0 = BigInt(20);
const txAmount = BigInt(3);
const aliceAmount1 = (aliceAmount0 - txAmount);
const bobAmount1 = (bobAmount0 + txAmount);

describe('camo', () => {
  it('camo amount test - basic', async () => {
    const amount0 = aliceAmount0 + bobAmount0;
    const amount1 = aliceAmount1 + bobAmount1;
    expect(amount0.toString()).to.deep.equal(amount1.toString());
  });
  it('camo amount test - encrypted', async () => {
    const bigintCryptoUtils = require('bigint-crypto-utils');
    const getSharedSecret = async () => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const publicKey1 = await bananojs.getCamoPublicKey(privateKey1);
      const sharedSecret01 = await bananojs.getSharedSecret(privateKey0, publicKey1);
      const sharedSecret10 = await bananojs.getSharedSecret(privateKey1, publicKey0);
      expect(sharedSecret01).to.deep.equal(sharedSecret10);
      return sharedSecret01;
    };

    const hash = (a) => {
      const blake = require( 'blakejs' );
      const bananoUtil = require('../../app/scripts/banano-util.js');
      const aBytes = bananoUtil.hexToBytes( a );
      const context = blake.blake2bInit( 32 );
      blake.blake2bUpdate( context, aBytes );
      const bBytes = blake.blake2bFinal( context );
      const b = bananoUtil.bytesToHex( bBytes );
      return b;
    };

    let maybePrimeHash = hash(getSharedSecret());
    let maybePrime = BigInt('0x' + maybePrimeHash);
    const getPrime = async () => {
      maybePrimeHash = hash(maybePrimeHash);
      maybePrime = BigInt('0x' + maybePrimeHash);
      while (!await bigintCryptoUtils.isProbablyPrime(maybePrime)) {
        maybePrimeHash = hash(maybePrimeHash);
        maybePrime = BigInt('0x' + maybePrimeHash);
      }
      return maybePrime;
    };
    const a = await getPrime();
    console.log('a', a);
    const n = await getPrime();
    console.log('n', n);

    const encrypt = (x) => {
      return (x + a) % n;
    };

    const encAliceAmount0 = encrypt(aliceAmount0);
    const encBobAmount0 = encrypt(bobAmount0);
    const encAliceAmount1 = encrypt(aliceAmount1);
    const encBobAmount1 = encrypt(bobAmount1);

    const amount0 = (encAliceAmount0 + encBobAmount0) % n;
    const amount1 = (encAliceAmount1 + encBobAmount1) % n;
    expect(amount0.toString()).to.deep.equal(amount1.toString());
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
