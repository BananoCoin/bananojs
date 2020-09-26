'use strict';

// libraries
const chai = require('chai');
const crypto = require('crypto');

// modules
const expect = chai.expect;

const ed25519_pkcs8_der_prefix = '302e020100300506032b657004220420';

const ed25519_spki_der_prefix = '302a300506032b6570032100';


const signAndVerify = (privateKeyObj, publicKeyObj, hash) => {
  const signature = crypto.sign(undefined, hash, privateKeyObj);
  const signatureHex = signature.toString('hex');
  const verified = crypto.verify(undefined, hash, publicKeyObj, Buffer.from(signatureHex, 'hex'));
  return verified;
};

const privateToDer = (privateKeyHex) => {
  const derHex = `${ed25519_pkcs8_der_prefix}${privateKeyHex}`;
  return Buffer.from(derHex, 'hex');
};

const privateKeyHexToObject = (privateKeyHex) => {
  const privateKeyObject = crypto.createPrivateKey( {key: privateToDer(privateKeyHex), format: 'der', type: 'pkcs8'} );
  return privateKeyObject;
};

const privateKeyObjecToHex = (privateKeyObj) => {
  const privateKey = privateKeyObj.export({type: 'pkcs8', format: 'der'}).toString('hex');
  expect(privateKey.length).to.equal(96);
  const privateKeyPrefix = privateKey.slice(0, ed25519_pkcs8_der_prefix.length);
  expect(privateKeyPrefix).to.equal(ed25519_pkcs8_der_prefix);
  const privateKeyHex = privateKey.slice(ed25519_pkcs8_der_prefix.length);
  expect(privateKeyHex.length).to.equal(64);
  return privateKeyHex;
};

const publicKeyObjecToHex = (publicKeyObj) => {
  const publicKey = publicKeyObj.export({type: 'spki', format: 'der'}).toString('hex');
  return publicKey;
};

describe('split-key', () => {
  it.only('test ed25519 key', () => {
    const keyObject = crypto.generateKeyPairSync('ed25519', {privateKeyEncoding: {type: 'pkcs8', format: 'der'}, namedCurve: 'ed25519'});
    const privateKey = keyObject.privateKey.toString('hex');
    expect(privateKey.length).to.equal(96);
    const privateKeyPrefix = privateKey.slice(0, ed25519_pkcs8_der_prefix.length);
    expect(privateKeyPrefix).to.equal(ed25519_pkcs8_der_prefix);
    const privateKeyHex = privateKey.slice(ed25519_pkcs8_der_prefix.length);
    expect(privateKeyHex.length).to.equal(64);
  }),
  it.only('test split key', () => {
    const privateKey0 = '0000000000000000000000000000000000000000000000000000000000000000';
    const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';

    const privateKeyObj0 = privateKeyHexToObject(privateKey0);
    console.log('privateKeyObj0', privateKeyObjecToHex(privateKeyObj0));
    const privateKeyObj1 = privateKeyHexToObject(privateKey1);
    console.log('privateKeyObj1', privateKeyObjecToHex(privateKeyObj1));

    const publicKeyObj0 = crypto.createPublicKey(privateKeyObj0);
    console.log('publicKeyObj0', publicKeyObjecToHex(publicKeyObj0));
    const publicKeyObj1 = crypto.createPublicKey(privateKeyObj1);
    console.log('publicKeyObj1', publicKeyObjecToHex(publicKeyObj1));

    const message = Buffer.from('00', 'hex');
    const verify0 = signAndVerify(privateKeyObj0, publicKeyObj0, message);
    console.log('verify0', verify0);
    const verify1 = signAndVerify(privateKeyObj1, publicKeyObj1, message);
    console.log('verify1', verify1);
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
  });
});


// > secret = scalar(rand())
// scalar(0xfffa1da85206e1b977e4eaa21460bdf220856254607513409f3734d10d7c030d)
//
// > point(secret)
// point(0xc79a62c82a5b5eb42f44b907a00a6a3223b906ec5fb27a7e0cbf582a5d9b3439)
//
// # in PlasmaPower/nano-vanity now
// $ cargo run 1abcd --public-offset c79a62c82a5b5eb42f44b907a00a6a3223b906ec5fb27a7e0cbf582a5d9b3439
// Found matching account!
// Extended private key: 2473C0360A3BAEDDB3154BE54BDC34C0D0AB6D1EC2DAF31E17BF7441B7EE3491
// Account:              xrb_1abcdgy8p64nj6fcretqe4ej1fuz46qqp4cj8cdqcoxinofjs1z7j77fmtrt
//
// # back to this REPL
// > skey = secret + scalar(0x2473C0360A3BAEDDB3154BE54BDC34C0D0AB6D1EC2DAF31E17BF7441B7EE3491)
// scalar(0xcefa399a6fc5e97ea27681cd8c731bf7f030d0722250075fb6f6a812c56a380e)
//
// > pk = point(scalar(skey))
// point(0x212a5bbc6b1054891aac3357609910377f112f7b095132977557b0a55b1c83e5)
//
// > nano_account_encode(pk)
// "xrb_1abcdgy8p64nj6fcretqe4ej1fuz46qqp4cj8cdqcoxinofjs1z7j77fmtrt"
//
// > r = scalar(rand())
// scalar(0xfe697ea299ff1e7e4eb2e1f940c9a41b93ebc9301c9b561e2c9fc7a75bea4300)
//
// > R = point(r)
// point(0xeefb043ab48d6765b565a6fb97b7026a9e3fd4e9aaa71bc55ab96c410002136a)
//
// > hash = nano_block_hash!({"type":"open","source":"B0311EA55708D6A53C75CDBF88300259C6D018522FE3D4D0A242E431F9E8B6D0","representative":"xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpiij4txtdo","account":"xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpiij4txtdo"})
// 0x04270d7f11c4b2b472f2854c5a59f2a7e84226ce9ed799de75744bd7d85fc9d9
//
// > hram = scalar(blake2b(bytes(R) + bytes(pk) + hash))
// scalar(0x8c37f7ed8dda106eacedb273cb4c4be74a56ec33a8b16b268f4bfb36152e1407)
//
// > s = r + hram * skey
// scalar(0x5089b75958e37a21e18f8f995fb30c50c491f71a1805b8d208aa6cb90809b103)
//
// > sig = bytes(R) + bytes(s)
// 0xeefb043ab48d6765b565a6fb97b7026a9e3fd4e9aaa71bc55ab96c410002136a5089b75958e37a21e18f8f995fb30c50c491f71a1805b8d208aa6cb90809b103
//
// > ed25519_validate(pk, hash, sig, "blake2b")
// true
