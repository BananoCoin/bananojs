'use strict';

// libraries
const chai = require('chai');
const elliptic = require('elliptic');
const bananojs = require('../../index.js');
const crypto = require('crypto');

// modules
const expect = chai.expect;

// PEM conversion
// https://scalingbitcoin.org/transcript/telaviv2019/threshold-scriptless-scripts
// https://gist.github.com/mauriciolobo/f205d2db54fc8f35749e7a01c5b894d2
const createPemFromKey = (keyPair) => {
  const pvtKey = `-----BEGIN PRIVATE KEY-----
${Buffer.from(`308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420${keyPair.getPrivateKey('hex')}a144034200${keyPair.getPublicKey('hex')}`, 'hex').toString('base64')}
-----END PRIVATE KEY-----`;

  const pubKey = `-----BEGIN PUBLIC KEY-----
${Buffer.from(`3056301006072a8648ce3d020106052b8104000a034200${keyPair.getPublicKey('hex')}`, 'hex').toString('base64')}
-----END PUBLIC KEY-----`;

  return {
    pvtKey,
    pubKey,
  };
};

const dec2hex = (dec) => {
  return BigInt(dec).toString(16);
};

const hex2dec = (hex) => {
  return BigInt('0x' + hex).toString(10);
};

const getRandomBytes32Base10 = () => {
  return hex2dec(crypto.randomBytes(32).toString('hex').toUpperCase());
};

const getRandomBytes32Base16 = () => {
  return crypto.randomBytes(32).toString('hex').toUpperCase();
};

describe('vanity', () => {
  const curves = [...Object.keys(elliptic.curves)].filter((value, index, arr) => {
    if (value == 'PresetCurve') {
      return false;
    }
    if (value == 'curve25519') {
      return false;
    }
    return true;
  }); ;
  for (let curveIx = 0; curveIx < curves.length; curveIx++) {
    const curve = curves[curveIx];
    describe(curve, async () => {
      const getKeyFromPrivate = (secret) => {
        const secretHex = BigInt(secret).toString(16);
        return elliptic.ec(curve).keyFromPrivate(secretHex);
      };

      const getKeyFromPublic = (publicKeyBase10) => {
        const publicKeyBase16 = {x: dec2hex(publicKeyBase10.x), y: dec2hex(publicKeyBase10.y)};
        return elliptic.ec(curve).keyFromPublic(publicKeyBase16);
      };

      const getPublicKey = (secret) => {
        const key = getKeyFromPrivate(secret).getPublic();
        const x = BigInt('0x' + key.getX().toString('hex'));
        const y = BigInt('0x' + key.getY().toString('hex'));
        return {'x': x.toString(10), 'y': y.toString(10)};
      };

      const scalarAdd = (a, b) => {
        const aInt = BigInt(a);
        const bInt = BigInt(b);
        const n = BigInt(elliptic.curves[curve].n);
        const cInt = (aInt + bInt) % n;
        return cInt.toString(10);
      };

      const publicKeyAdd = (a, b) => {
        const aHex = {x: dec2hex(a.x), y: dec2hex(a.y)};
        const bHex = {x: dec2hex(b.x), y: dec2hex(b.y)};
        const aKey = elliptic.ec(curve).keyFromPublic(aHex, 'hex');
        const bKey = elliptic.ec(curve).keyFromPublic(bHex, 'hex');
        const cKeyPublic = aKey.getPublic().add(bKey.getPublic());
        const cx = BigInt('0x' + cKeyPublic.getX().toString('hex'));
        const cy = BigInt('0x' + cKeyPublic.getY().toString('hex'));
        return {'x': cx.toString(10), 'y': cy.toString(10)};
      };
      it('random', () => {
        const a = getRandomBytes32Base10();
        const A = getPublicKey(a);
        const b = getRandomBytes32Base10();
        const B = getPublicKey(b);
        const ab = scalarAdd(a, b);
        const pubab = getPublicKey(ab);
        const AB = publicKeyAdd(A, B);
        expect(pubab).to.deep.equal(AB);
        // console.log(curve, pubab, AB);

        const msg = getRandomBytes32Base16();
        const abKey = getKeyFromPrivate(ab);
        const signature = abKey.sign(msg);
        const derSign = signature.toDER();
        expect(true).to.deep.equal(abKey.verify(msg, derSign));

        const ABKey = getKeyFromPublic(AB);
        expect(true).to.deep.equal(ABKey.verify(msg, derSign));
      });
      it('ban2wax', () => {
        // wanda has wax. bob has banano. they want to trade.
        // wanda puts her wax into a time lock SC on wax.
        // wanda puts her public key wandaPublic into the SC.
        // wanda puts her camoPublic into the SC.
        // bob puts his camoPublic into the SC.
        // both wanda and bob have a shared secret.

        // bob wants to fund a vanity for wanda, and give her the private key.
        // wanda wants to confirm bob has the private key before releasing the SC.
        // bob wants to confirm wanda has the private key before releasing the SC.
        const wandaPrivate = getRandomBytes32Base10();
        const wandaPublic = getPublicKey(wandaPrivate);
        const bobPrivate = getRandomBytes32Base10();
        const bobPublic = getPublicKey(bobPrivate);

        const bobVanityPublic = publicKeyAdd(bobPublic, wandaPublic);
        // at this point bob knows the vanity's public address.
        // bob wants to provei it to wanda, so he sends wanda a message and a signature, encrypted with their shared secret.
        const bobMessage = getRandomBytes32Base16();
        const bobSignature = getKeyFromPrivate(bobPrivate).sign(bobMessage).toDER();

        const wandaMessage = getRandomBytes32Base16();
        const wandaSignature = getKeyFromPrivate(wandaPrivate).sign(wandaMessage).toDER();

        // wanda verifies the bobPublic signature, proving bob has bobPrivate
        // which proves he can give her the bobPrivate key that unlocks bobVanityPublic.
        expect(true).to.deep.equal(getKeyFromPublic(bobPublic).verify(bobMessage, bobSignature));
        expect(true).to.deep.equal(getKeyFromPublic(wandaPublic).verify(wandaMessage, wandaSignature));

        // at this point wanda instructs the SC to release the wax if it gets the private key from bob or wanda. wanda has comitted now, and cannot cancel until the time lock.
        // if the SC gets the private key from wanda, bob can get the bananos, so SC sends wax to bob.
        // if the SC gets the private key from bob, wanda can get the bananos, so SC sends wax to wanda.

        const wandaVanityPrivate = scalarAdd(wandaPrivate, bobPrivate);
        // at this point wanda knows the vanity's private address.
        const wandaVanityPublic = getPublicKey(wandaVanityPrivate);
        // at this point wanda confirms the vanity's public address and can withdraw.
        expect(wandaVanityPublic).to.deep.equal(bobVanityPublic);
      });
    });
  }

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});
