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

const getPublicKeyPem = (pubKeyHex) => {
  return `-----BEGIN PUBLIC KEY-----
${Buffer.from(`3056301006072a8648ce3d020106052b8104000a034200${pubKeyHex}`, 'hex').toString('base64')}
-----END PUBLIC KEY-----`;
};

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

const getEc = (curve) => {
  if (curve == 'banano') {
    const ecEd = elliptic.ec('ed25519');

    const ec = {};
    ec.n = BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989');

    const getPublicKeyHex = (publicKeyRaw, format) => {
      console.log('getPublicKeyHex', 'publicKeyRaw', publicKeyRaw.length, publicKeyRaw, 'format', format);
      if (format === 'hex') {
        return publicKeyRaw;
      } else {
        const publicKeyEd = {x: publicKeyX, y: publicKeyY};
        const keyEd = ecEd.keyFromPublic(getPubKey(publicKeyRaw), format);
        return keyEd.encode('hex');
      }
    };

    const getPublicKeyObj = (publicKeyRaw, format) => {
      const publicKeyHex = getPublicKeyHex(publicKeyRaw, format);
      console.log('getPublicKeyObj', 'publicKeyHex', publicKeyHex.length, publicKeyHex);
      const keyEd = ecEd.keyFromPublic(publicKeyHex);
      const publicKeyObj = {};
      publicKeyObj.getX = () => {
        return keyEd.getPublic().getX();
      };
      publicKeyObj.getY = () => {
        return keyEd.getPublic().getY();
      };
      publicKeyObj.add = (that) => {
        const thisPublicKeyEd = {x: publicKeyX, y: publicKeyY};
        const thatPublicKeyEd = {x: publicKeyX, y: publicKeyY};
        const thisKeyEd = ecEd.keyFromPublic(thisPublicKeyEd);
        const thatKeyEd = ecEd.keyFromPublic(thatPublicKeyEd);
        const addKeyEd = thisKeyEd.getPublic().add(thatKeyEd.getPublic());
        const addKey = {x: addKeyEd.getX(), y: addKeyEd.getY()};
        return getPublicKeyObj(addKey);
        // console.log('add', 'publicKey', publicKey.length, publicKey, 'that', that);
      };
      return publicKeyObj;
    };

    ec.keyFromPublic = async (publicKeyRaw, format) => {
      const key = {
        public: getPublicKeyHex(publicKeyRaw, format),
      };
      key.getPublic = () => {
        return getPublicKeyObj(publicKeyRaw, format);
      };
      key.verify = (hash, signature) => {
        const publicKey = getPublicKeyHex(publicKeyRaw, format);
        return bananojs.bananoUtil.verify(hash, signature, publicKey);
      };
      // console.log('keyFromPublic', 'publicKey', publicKey.length, publicKey);
      return key;
    };
    ec.keyFromPrivate = async (privateKey) => {
      privateKey = privateKey.padStart(64, '0');
      console.log('keyFromPrivate', 'privateKey', privateKey.length, privateKey);
      // const privateKey0 = privateKey.substring(0, 32);
      // console.log('keyFromPrivate', 'privateKey0', privateKey0.length, privateKey0);
      const publicKey = await bananojs.camoUtil.getCamoPublicKey(privateKey);
      const publicKeyEd = ecEd.keyFromPrivate(privateKey).getPublic().encode('hex');
      console.log('keyFromPrivate', 'publicKey', publicKey.length, publicKey);
      console.log('keyFromPrivate', 'publicKeyEd', publicKeyEd.length, publicKeyEd);
      const key = {
        private: privateKey,
        public: publicKey,
      };
      key.getPublic = () => {
        return getPublicKeyObj(publicKey, 'hex');
      };
      key.sign = (message) => {
        const sig = {
          toDER: () => {
            return bananojs.bananoUtil.signHash(privateKey, message);
          },
        };
        return sig;
      };
      return key;
    };
    return ec;
  }
  return elliptic.ec(curve);
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
  // curves.push('banano');
  for (let curveIx = 0; curveIx < curves.length; curveIx++) {
    const curve = curves[curveIx];
    describe(curve, async () => {
      const getKeyFromPrivate = async (secret) => {
        const secretHex = BigInt(secret).toString(16);
        const ec = getEc(curve);
        return await ec.keyFromPrivate(secretHex);
      };

      const getKeyFromPublic = async (publicKeyBase10) => {
        const publicKeyBase16 = {x: dec2hex(publicKeyBase10.x), y: dec2hex(publicKeyBase10.y)};
        const ec = getEc(curve);
        return await ec.keyFromPublic(publicKeyBase16);
      };

      const getPublicKey = async (secret) => {
        const key = await getKeyFromPrivate(secret);
        const publicKey = key.getPublic();
        const x = BigInt('0x' + publicKey.getX().toString('hex'));
        const y = BigInt('0x' + publicKey.getY().toString('hex'));
        return {'x': x.toString(10), 'y': y.toString(10)};
      };

      const scalarAdd = (a, b) => {
        const aInt = BigInt(a);
        const bInt = BigInt(b);
        const n = BigInt(getEc(curve).n);
        // console.log('scalarAdd', curve, n);
        const cInt = (aInt + bInt) % n;
        return cInt.toString(10);
      };

      const publicKeyAdd = async (a, b) => {
        const aHex = {x: dec2hex(a.x), y: dec2hex(a.y)};
        const bHex = {x: dec2hex(b.x), y: dec2hex(b.y)};
        const ec = getEc(curve);
        const aKey = await ec.keyFromPublic(aHex);
        const bKey = await ec.keyFromPublic(bHex);
        const cKeyPublic = aKey.getPublic().add(bKey.getPublic());
        const cx = BigInt('0x' + cKeyPublic.getX().toString('hex'));
        const cy = BigInt('0x' + cKeyPublic.getY().toString('hex'));
        return {'x': cx.toString(10), 'y': cy.toString(10)};
      };

      it('random', async () => {
        const a = getRandomBytes32Base10();
        const A = await getPublicKey(a);
        const b = getRandomBytes32Base10();
        const B = await getPublicKey(b);
        const ab = scalarAdd(a, b);
        const pubab = await getPublicKey(ab);
        const AB = await publicKeyAdd(A, B);
        expect(pubab).to.deep.equal(AB);
        // console.log(curve, pubab, AB);

        const msg = getRandomBytes32Base16();
        const abKey = await getKeyFromPrivate(ab);
        const signature = abKey.sign(msg);
        const derSign = signature.toDER();
        expect(true).to.deep.equal(abKey.verify(msg, derSign));

        const ABKey = await getKeyFromPublic(AB);
        expect(true).to.deep.equal(ABKey.verify(msg, derSign));
      });
      it('ban2wax', async () => {
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
        const wandaPublic = await getPublicKey(wandaPrivate);
        const bobPrivate = getRandomBytes32Base10();
        const bobPublic = await getPublicKey(bobPrivate);

        const bobVanityPublic = await publicKeyAdd(bobPublic, wandaPublic);
        // at this point bob knows the vanity's public address.
        // bob wants to provei it to wanda, so he sends wanda a message and a signature, encrypted with their shared secret.
        const bobMessage = getRandomBytes32Base16();
        const bobKeyFromPrivate = await getKeyFromPrivate(bobPrivate);
        const bobSignature = bobKeyFromPrivate.sign(bobMessage).toDER();

        const wandaMessage = getRandomBytes32Base16();
        const wandaKeyFromPrivate = await getKeyFromPrivate(wandaPrivate);
        const wandaSignature = wandaKeyFromPrivate.sign(wandaMessage).toDER();

        // wanda verifies the bobPublic signature, proving bob has bobPrivate
        // which proves he can give her the bobPrivate key that unlocks bobVanityPublic.
        const bobKeyFromPublic = await getKeyFromPublic(bobPublic);
        expect(true).to.deep.equal(bobKeyFromPublic.verify(bobMessage, bobSignature));
        const wandaKeyFromPublic = await getKeyFromPublic(wandaPublic);
        expect(true).to.deep.equal(wandaKeyFromPublic.verify(wandaMessage, wandaSignature));

        // at this point wanda instructs the SC to release the wax if it gets the private key from bob or wanda. wanda has comitted now, and cannot cancel until the time lock.
        // if the SC gets the private key from wanda, bob can get the bananos, so SC sends wax to bob.
        // if the SC gets the private key from bob, wanda can get the bananos, so SC sends wax to wanda.

        const wandaVanityPrivate = scalarAdd(wandaPrivate, bobPrivate);
        // at this point wanda knows the vanity's private address.
        const wandaVanityPublic = await getPublicKey(wandaVanityPrivate);
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
