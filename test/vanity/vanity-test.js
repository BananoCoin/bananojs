'use strict';

// libraries
const chai = require('chai');
const elliptic = require('elliptic');
const bananojs = require('../../index.js');
const crypto = require('crypto');

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

/**
 * plasma power says use Curve25519
 */
const getCurve25519PublicKey = (privateKey) => {
  const key = curve25519.keyFromPrivate(privateKey);
  const publicKey = key.getPublic('hex');
  return publicKey;
};

const getCamoPublicKey = (privateKey) => {
  // const key = curve25519.keyFromPrivate(privateKey);
  // const publicKey = key.getPublic('hex');
  // return publicKey;
  return bananojs.camoUtil.getCamoPublicKey(privateKey);
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
  describe('secp256k1', async () => {
    const hex2dec = (hex) => {
      return BigInt('0x' + hex).toString(10);
    };
    const dec2hex = (dec) => {
      return BigInt(dec).toString(16);
    };
    const getPublicKey = (secret) => {
      const secretHex = BigInt(secret).toString(16);
      const key = new require('elliptic').ec('secp256k1').keyFromPrivate(secretHex).getPublic();
      const x = BigInt('0x' + key.getX().toString('hex'));
      const y = BigInt('0x' + key.getY().toString('hex'));
      return {'x': x.toString(10), 'y': y.toString(10)};
    };

    const scalarAddsecp256k1 = (a, b) => {
      const aInt = BigInt(a);
      const bInt = BigInt(b);
      const n = BigInt(elliptic.curves.secp256k1.n);
      const cInt = (aInt + bInt) % n;
      return cInt.toString(10);
    };

    const publicKeyAdd = (a, b) => {
      const aHex = {x: dec2hex(a.x), y: dec2hex(a.y)};
      const bHex = {x: dec2hex(b.x), y: dec2hex(b.y)};
      const aKey = new require('elliptic').ec('secp256k1').keyFromPublic(aHex, 'hex');
      const bKey = new require('elliptic').ec('secp256k1').keyFromPublic(bHex, 'hex');
      const cKeyPublic = aKey.getPublic().add(bKey.getPublic());
      const cx = BigInt('0x' + cKeyPublic.getX().toString('hex'));
      const cy = BigInt('0x' + cKeyPublic.getY().toString('hex'));
      return {'x': cx.toString(10), 'y': cy.toString(10)};
    };
    it('medium1', () => {
      // https://medium.com/coinmonks/having-fun-with-bitcoins-vanity-bitcoin-address-generation-fea28f855173
      const a = '86061879872531449951982497796959448028218381820041432789293827894874333168061';
      console.log('a ', a);
      const A = getPublicKey(a);
      console.log('A ', A);
      expect(A).to.deep.equal({'x': '52281756525516179214864400768152603516588884663484649962958165358048515611229', 'y': '3506106637400073941700097757900439597340138321945710007917595359770824320067'});
      const b = '67049838517580778648042191759706328871467476377487957098163453293050470005128';
      console.log('b ', b);
      const B = getPublicKey(b);
      expect(B).to.deep.equal({'x': '92274947923957043323674480256700292927552770224860750077123722920663254277413', 'y': '111720110584941718181062835691990151475626279782674278759154810677066455066531'});
      console.log('B ', B);

      const ab = scalarAddsecp256k1(a, b);
      console.log('ab', ab);
      expect(ab).to.deep.equal('37319629152796033176453704547977869046848293918454485504852118046406641678852');
      const pubab = getPublicKey(ab);
      console.log('pub(ab)', pubab);

      const AB = publicKeyAdd(A, B);
      console.log('AB     ', AB);
      expect(pubab).to.deep.equal(AB);
    });
    it('medium2', () => {
      // https://medium.com/coinmonks/having-fun-with-bitcoins-vanity-bitcoin-address-generation-fea28f855173
      const a = '37544424288798154074699611267566568869439865116767126704627649615729956116506';
      console.log('a ', a);
      const A = getPublicKey(a);
      console.log('A ', A);
      expect(A).to.deep.equal({'x': '7773862538751737473937295719318311358302568935895129183019906348275114777491', 'y': '22406706549294556963067038457614296446395774955163148604195506906674312447267'});
      const b = '41296629901520693467695193373708811558337640709177581239186518957316582388451';
      console.log('b ', b);
      const B = getPublicKey(b);
      expect(B).to.deep.equal({'x': '111532918341694246238837218125969374681770874004257091402871731719047118628067', 'y': '72060607001291060261631509160074138090626419316501810838466820076685497359322'});
      console.log('B ', B);

      const ab = scalarAddsecp256k1(a, b);
      console.log('ab', ab);
      expect(ab).to.deep.equal('78841054190318847542394804641275380427777505825944707943814168573046538504957');
      const pubab = getPublicKey(ab);
      console.log('pub(ab)', pubab);

      const AB = publicKeyAdd(A, B);
      console.log('AB     ', AB);
      expect(pubab).to.deep.equal(AB);
    });
  });
  describe('banano', () => {
    const getRandomSeed = () => {
      return crypto.randomBytes(32).toString('hex').toUpperCase();
    };
    const addPrivateKeys = (privateKey0, privateKey1) => {
      const privateKey0Int = BigInt('0x' + privateKey0);
      const privateKey1Int = BigInt('0x' + privateKey1);
      const nInt = BigInt(elliptic.curves.ed25519.n);
      const privateKey01Int = (privateKey0Int + privateKey1Int)%nInt;
      let privateKey2 = privateKey01Int.toString(16);
      while (privateKey2.length < 64) {
        privateKey2 = '0' + privateKey2;
      }
      return privateKey2;
    };
    const addPublicKeys = (publicKey0, publicKey1) => {
      const key0 = ed25519.decodePoint(publicKey0, 'hex');
      const key1 = ed25519.decodePoint(publicKey1, 'hex');
      // console.log('addPublicKeys', 'key0', key0);
      // console.log('addPublicKeys', 'key1', key1);
      let key2 = key0.add(key1);
      // console.log('addPublicKeys', 'key2', key2);
      key2 = key2.normalize();
      key2 = key2.encode('hex', true).toUpperCase();

      return key2.substring(2);
    };
    it('random', async () => {
      const seed0 = getRandomSeed();
      const seed1 = getRandomSeed();
      const privateKey0 = bananojs.bananoUtil.getPrivateKey(seed0, 0);
      const privateKey1 = bananojs.bananoUtil.getPrivateKey(seed1, 0);
      const publicKey0 = await bananojs.bananoUtil.getPublicKey(privateKey0);
      const publicKey1 = await bananojs.bananoUtil.getPublicKey(privateKey1);
      const privateKey01 = addPrivateKeys(privateKey0, privateKey1);
      // console.log('random', 'privateKey01', privateKey01.length, privateKey01);
      const publicKey01 = addPublicKeys(publicKey0, publicKey1);
      const privateKey01pub = await bananojs.bananoUtil.getPublicKey(privateKey01);
      console.log('random', 'publicKey01    ', publicKey01.length, publicKey01);
      console.log('random', 'privateKey01pub', privateKey01pub.length, privateKey01pub);
      expect(privateKey01pub).to.deep.equal(publicKey01);
    });
  });
  describe.skip('PlasmaPower', () => {
    it('point derivation', async () => {
      const secret = 'FFFA1DA85206E1B977E4EAA21460BDF220856254607513409F3734D10D7C030D';
      console.log('secret', secret);
      const point = new require('elliptic').ec('curve25519').keyFromPrivate(secret).getPublic('hex');
      console.log('point', point);
    });
    it('public key derivation', async () => {
      const secret = '0000000000000000000000000000000000000000000000000000000000000000';
      console.log('secret', secret);
      const secretPublicKeyCurve25519 = getCurve25519PublicKey(secret);
      console.log('actual   secret public key Curve25519', secretPublicKeyCurve25519);
      const expectedSecretPublicKeyCurve25519 = '80989F0ED4154E886AD926392DB1F9B524AB250A1BEEBA6C999A2F06C36F7E00';
      console.log('expected secret public key Curve25519', expectedSecretPublicKeyCurve25519);
    });
    it('split key generation', async () => {
      // https://raw.githubusercontent.com/PlasmaPower/curve25519-repl/master/examples/nano/secure-distributed-vanity-address-gen.txt
      const secret = 'FFFA1DA85206E1B977E4EAA21460BDF220856254607513409F3734D10D7C030D';
      console.log('secret', secret);

      const secretPublickeyCurve25519 = getCurve25519PublicKey(secret);
      console.log('actual   secret public key Curve25519', secretPublickeyCurve25519);

      const expectedSecretPublicKeyCurve25519 = 'C79A62C82A5B5EB42F44B907A00A6A3223B906EC5FB27A7E0CBF582A5D9B3439';
      console.log('expected secret public key Curve25519', expectedSecretPublicKeyCurve25519);

      const offset = '2473C0360A3BAEDDB3154BE54BDC34C0D0AB6D1EC2DAF31E17BF7441B7EE3491';
      console.log('offset', offset);

      const vanityPrivateKey = scalarAdd(secret, offset);
      console.log('vanity private key', vanityPrivateKey);

      const vanityPublicKeyCurve25519 = getCurve25519PublicKey(vanityPrivateKey);
      console.log('vanity public key Curve25519', vanityPublicKeyCurve25519);
      // const vanityAccountCurve25519 = getBananoAccount(vanityPublicKeyCurve25519);
      // console.log('vanity account Curve25519', vanityAccountCurve25519);

      // const vanityPublicKeyEd25519 = getEd25519PublicKey(vanityPrivateKey);
      // console.log('vanity public key Ed25519', vanityPublicKeyEd25519);
      // const vanityAccountEd25519 = getBananoAccount(vanityPublicKeyEd25519);
      // console.log('vanity account Ed25519', vanityAccountEd25519);


      const expectedVanityPrivateKeyPlasmaPower = 'CEFA399A6FC5E97EA27681CD8C731BF7F030D0722250075FB6F6A812C56A380E';
      console.log('actual   vanity private key PlasmaPower', vanityPrivateKey);
      console.log('expected vanity private key PlasmaPower', expectedVanityPrivateKeyPlasmaPower);
      const vanityPublicKeyPlasmaPower = getCurve25519PublicKey(expectedVanityPrivateKeyPlasmaPower);
      console.log('actual   vanity public key PlasmaPower', vanityPublicKeyPlasmaPower);

      const expectedVanityPublicKeyPlasmaPower = '212A5BBC6B1054891AAC3357609910377F112F7B095132977557B0A55B1C83E5';
      console.log('expected vanity public key PlasmaPower', expectedVanityPublicKeyPlasmaPower);
      const vanityAccountPlasmaPower = getBananoAccount(expectedVanityPublicKeyPlasmaPower);
      console.log('actual   vanity account PlasmaPower', vanityAccountPlasmaPower);
      const expectedVanityAccountPlasmaPower = 'ban_1abcdgy8p64nj6fcretqe4ej1fuz46qqp4cj8cdqcoxinofjs1z7j77fmtrt';
      console.log('expected vanity account PlasmaPower', expectedVanityAccountPlasmaPower);
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});
