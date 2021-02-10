'use strict';

// libraries
const chai = require('chai');
const elliptic = require('elliptic');
const bananojs = require('../../index.js');
const crypto = require('crypto');
const nacl = require('../../libraries/tweetnacl/nacl.js');

// modules
const expect = chai.expect;

// PEM conversion
// https://scalingbitcoin.org/transcript/telaviv2019/threshold-scriptless-scripts
// https://gist.github.com/mauriciolobo/f205d2db54fc8f35749e7a01c5b894d2

const getPublicKeyDerX25519 = (publicKeyHex) => {
  const publicKeyDerHex = `302a300506032b656e032100${publicKeyHex}`;
  return Buffer.from(publicKeyDerHex, 'hex');
};

const getPublicKeyDerEd25519 = (publicKeyHex) => {
  const publicKeyDerHex = `302a300506032b6570032100${publicKeyHex}`;
  return Buffer.from(publicKeyDerHex, 'hex');
};

const getPublicKeyPemX25519 = (publicKeyHex) => {
  const publicKeyDer = getPublicKeyDerX25519(publicKeyHex);
  const publicKeyDerBase64 = publicKeyDer.toString('base64');
  const publicKeyHexPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyDerBase64}\n-----END PUBLIC KEY-----`;
  // return Buffer.from(, 'hex');
  return publicKeyHexPem;
  // return keyEncoder.encodePublic(publicKeyHex, 'raw', 'pem');
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

const bytesToHex = bananojs.bananoUtil.bytesToHex;

const hexToBytes = bananojs.bananoUtil.hexToBytes;

const eddsa25519 = elliptic.eddsa('ed25519');

const eced25519 = elliptic.ec('ed25519');

const eccurve25519 = elliptic.ec('curve25519');

const ed25519PointToCurve25519 = (ed25519Point) => {
  const y = ed25519Point.y;
  const z = ed25519Point.z;
  // curve25519_add(yplusz, p.y, p.z);
  const yplusz = y.redAdd(z);

  // curve25519_sub(zminusy, p.z, p.y);
  const zminusy = z.redSub(y);

  // curve25519_recip(zminusy, zminusy);
  const zinv = zminusy.redInvm();

  // curve25519_mul(yplusz, yplusz, zminusy);
  const zmul = yplusz.redMul(zinv);

  // curve25519_contract(pk, yplusz);
  const x = zmul.fromRed();

  return curve25519.point(x, 1);
};

console.log('der', crypto.generateKeyPairSync('x25519').publicKey.export({format: 'der', type: 'spki'}).toString('hex'));
console.log('der', crypto.generateKeyPairSync('x25519').publicKey.export({format: 'der', type: 'spki'}).toString('hex'));

describe('vanity', () => {
  describe('banano', async () => {
    const getKeyFromPrivate = async (secret) => {
      const secretHex = BigInt('0x' + secret).toString(16);
      return await eddsa25519.keyFromSecret(secretHex);
    };

    const getKeyFromPublic = async (publicKeyHex) => {
      console.log('getKeyFromPublic', publicKeyHex);
      return await eddsa25519.keyFromPublic(publicKeyHex, 'hex');
    };

    const bananoToCamoPublicKeyMap = new Map();
    const canmToBananoPublicKeyMap = new Map();

    const toXYPoint = (publicKey) => {
      const x = publicKey.getX().toString('hex');
      const y = publicKey.getY().toString('hex');
      const camoPublicKeyCheck = {'x': x, 'y': y};
      return camoPublicKeyCheck;
    };

    const getPublicKey = async (secret) => {
      const bananoPublicKey = await bananojs.bananoUtil.getPublicKey(secret);
      const camoPublicKey = await bananojs.camoUtil.getCamoPublicKey(secret);

      const bananoPublicKeyCheck = edToCurve(bananoPublicKey);
      expect(camoPublicKey).to.deep.equal(bananoPublicKeyCheck);

      const key = await eced25519.keyFromPrivate(secret);
      const publicKey = key.getPublic();
      const camoPublicKeyCheck = toXYPoint(publicKey);

      console.log('getPublicKey', bananoPublicKey, camoPublicKeyCheck);
      bananoToCamoPublicKeyMap.set(bananoPublicKey, camoPublicKeyCheck);
      canmToBananoPublicKeyMap.set(camoPublicKeyCheck.toString(), bananoPublicKey);
      return bananoPublicKey;
    };

    const scalarAdd = (a, b) => {
      console.log('scalarAdd', 'a', a);
      console.log('scalarAdd', 'b', b);
      const aInt = BigInt('0x'+a);
      const bInt = BigInt('0x'+b);
      const n = BigInt(eced25519.n);
      // console.log('scalarAdd', curve, n);
      const cInt = (aInt + bInt) % n;
      const c = cInt.toString(16).padStart(64, '0');
      console.log('scalarAdd', 'c', c);
      return c;
    };

    // const curveToEd = (p) => {
    //   return bytesToHex(nacl.convert_curve25519_to_ed25519_public_key(hexToBytes(p)));
    // };

    const edToCurve = (p) => {
      return bytesToHex(nacl.convert_ed25519_to_curve25519_public_key(hexToBytes(p)));
    };

    const publicKeyAdd = async (a, b) => {
      // console.log('publicKeyAdd', 'eced25519', eced25519);
      console.log('publicKeyAdd', 'a', a);
      console.log('publicKeyAdd', 'b', b);
      const aCurve = bananoToCamoPublicKeyMap.get(a);
      const bCurve = bananoToCamoPublicKeyMap.get(b);
      console.log('publicKeyAdd', 'aCurve', aCurve);
      console.log('publicKeyAdd', 'bCurve', bCurve);
      // const aCurveCheck = edToCurve(a);
      // const bCurveCheck = edToCurve(b);
      // console.log('publicKeyAdd', 'aCurveCheck', aCurveCheck);
      // console.log('publicKeyAdd', 'bCurveCheck', bCurveCheck);
      // const aEdCheck = curveToEd(a);
      // const bEdCheck = curveToEd(b);
      // console.log('publicKeyAdd', 'aEdCheck', aEdCheck);
      // console.log('publicKeyAdd', 'bEdCheck', bEdCheck);
      // expect(aCurve).to.deep.equal(aCurveCheck);
      // expect(bCurve).to.deep.equal(bCurveCheck);
      const aKey = eced25519.keyFromPublic(aCurve, 'hex');
      const bKey = eced25519.keyFromPublic(bCurve, 'hex');
      const cKey = aKey.getPublic().add(bKey.getPublic());
      const cPoint = toXYPoint(cKey);
      console.log('publicKeyAdd', 'cPoint', cPoint);
      const c = canmToBananoPublicKeyMap.get(cPoint.toString());
      console.log('publicKeyAdd', 'c', c);
      return c;
    };

    it('random', async () => {
      const a = getRandomBytes32Base16();
      const A = await getPublicKey(a);
      const b = getRandomBytes32Base16();
      const B = await getPublicKey(b);
      const ab = scalarAdd(a, b);
      const pubab = await getPublicKey(ab);
      const AB = await publicKeyAdd(A, B);
      expect(pubab).to.deep.equal(AB);
      // console.log(curve, pubab, AB);

      const msg = getRandomBytes32Base16();
      const abKey = await getKeyFromPrivate(ab);
      const abSignature = abKey.sign(msg);
      expect(true).to.deep.equal(abKey.verify(msg, abSignature));

      const signature = bananojs.bananoUtil.signHash(ab, msg);
      const verified = await bananojs.bananoUtil.verify(msg, signature, AB);
      expect(true).to.deep.equal(verified);
      // const ABKey = await getKeyFromPublic(AB);
      // expect(true).to.deep.equal(ABKey.verify(msg, signature));
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});
