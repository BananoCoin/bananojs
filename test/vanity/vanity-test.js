'use strict';

// libraries
const chai = require('chai');
const elliptic = require('elliptic');
const bananojs = require('../../index.js');

// modules
const curve25519 = new elliptic.ec('curve25519');
const ed25519 = new elliptic.eddsa('ed25519');
const expect = chai.expect;

const scalarAdd = (a, b) => {
  const aInt = elliptic.utils.intFromLE(a);
  const bInt = elliptic.utils.intFromLE(b);
  const cInt = aInt.add(bInt).umod(elliptic.curves.ed25519.n);
  return bananojs.bananoUtil.bytesToHex(cInt.toArray('le', 32));
};

const getCurve25519PublicKey = (privateKey) => {
  const key = curve25519.keyFromPrivate(privateKey);
  const publicKey = key.getPublic().encode('hex');
  return publicKey;
};

const getEd25519PublicKey = (secretKey) => {
  const key = ed25519.keyFromSecret(secretKey);
  const publicKey = bananojs.bananoUtil.bytesToHex(key.getPublic());
  return publicKey;
};

const getBananoAccount = (publicKey) => {
  return bananojs.bananoUtil.getAccount(publicKey, bananojs.BANANO_PREFIX);
};

describe('vanity', () => {
  describe('PlasmaPower', () => {
    it('split key generation', async () => {
      // https://raw.githubusercontent.com/PlasmaPower/curve25519-repl/master/examples/nano/secure-distributed-vanity-address-gen.txt
      const secret = 'fffa1da85206e1b977e4eaa21460bdf220856254607513409f3734d10d7c030d';
      console.log('secret', secret);

      // const secretPubPriKey = ed25519.keyFromSecret(secret);
      // const secretPubKey = bananojs.bananoUtil.bytesToHex(secretPubPriKey.getPublic());
      // const secretPubPriKey = curve25519.keyFromPrivate(secret);
      // console.log('secret', secret);
      // const secretPubKey = secretPubPriKey.getPublic().encode('hex');
      // console.log('secretPubKey', secretPubKey);
      // const expectedSecretPubKey = 'c79a62c82a5b5eb42f44b907a00a6a3223b906ec5fb27a7e0cbf582a5d9b3439';
      // expect(secretPubKey).to.deep.equal(expectedSecretPubKey);

      const offset = '2473C0360A3BAEDDB3154BE54BDC34C0D0AB6D1EC2DAF31E17BF7441B7EE3491';
      console.log('offset', offset);

      const vanityPrivateKey = scalarAdd(secret, offset);
      console.log('vanity private key', vanityPrivateKey);

      const vanityPublicKeyCurve25519 = getCurve25519PublicKey(vanityPrivateKey);
      console.log('vanity public key Curve25519', vanityPublicKeyCurve25519);
      const vanityAccountCurve25519 = getBananoAccount(vanityPublicKeyCurve25519);
      console.log('vanity account Curve25519', vanityAccountCurve25519);

      const vanityPublicKeyEd25519 = getEd25519PublicKey(vanityPrivateKey);
      console.log('vanity public key Ed25519', vanityPublicKeyEd25519);
      const vanityAccountCEd25519 = getBananoAccount(vanityPublicKeyEd25519);
      console.log('vanity account Ed25519', vanityAccountCEd25519);
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});
