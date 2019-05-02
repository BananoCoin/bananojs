const assert = require('chai').assert;
const expect = require('chai').expect;

const nacl = require('../../libraries/tweetnacl/nacl.js');

const bananoUtil = require('../../app/scripts/banano-util.js');

const camoUtil = require('../../app/scripts/camo-util.js');

const camoTestData = require('./camo-test-data.json');

const getPrivateKey0Bytes = () => {
  const privateKey0 = bananoUtil.getPrivateKey(camoTestData.seed0, 0);
  const privateKey0Bytes = bananoUtil.hexToBytes(privateKey0);
  return privateKey0Bytes;
};

describe('camo-keys', () => {
  it('public-key', async () => {
    const privateKey0 = bananoUtil.getPrivateKey(camoTestData.seed0, 0);

    const privateKeyF = bananoUtil.getPrivateKey(camoTestData.seedF, 0);

    const publicKey0 = bananoUtil.getPublicKey(privateKey0);

    expect(publicKey0).to.deep.equal(camoTestData.seed0public0);
  });
  it('camo-public-key', async () => {
    const privateKey0 = bananoUtil.getPrivateKey(camoTestData.seed0, 0);
    const publicKey0 = bananoUtil.getPublicKey(privateKey0);

    const privateKeyF = bananoUtil.getPrivateKey(camoTestData.seedF, 0);
    const publicKeyF = bananoUtil.getPublicKey(privateKeyF);

    const privateKey0Bytes = bananoUtil.hexToBytes(privateKey0);
    const privateKeyFBytes = bananoUtil.hexToBytes(privateKeyF);

    const camoPublicKey0Bytes = nacl.scalarMult.base(privateKey0Bytes);
    const camoPublicKeyFBytes = nacl.scalarMult.base(privateKeyFBytes);

    //        console.log( `privateKey0Bytes.length ${privateKey0Bytes.length}` );
    //        console.log( `privateKeyFBytes.length ${privateKeyFBytes.length}` );
    //        console.log( `camoPublicKey0Bytes.length ${camoPublicKey0Bytes.length}` );
    //        console.log( `camoPublicKeyFBytes.length ${camoPublicKeyFBytes.length}` );

    const secret0 = bananoUtil.bytesToHex(nacl.scalarMult(privateKeyFBytes, camoPublicKey0Bytes));
    const secretF = bananoUtil.bytesToHex(nacl.scalarMult(privateKey0Bytes, camoPublicKeyFBytes));

    expect(secret0).to.deep.equal(secretF);
  });
  it('banano-nacl-fromSecretKey', async () => {
    const privateKey0Bytes = getPrivateKey0Bytes();
    const camoPrivateKey0Bytes = nacl.camo.hashsecret(privateKey0Bytes);
    const publicKeyFromSecretKey0Bytes = nacl.sign.keyPair.fromSecretKey(privateKey0Bytes).publicKey;
    const publicKeyFromUnhashedSecretKey0Bytes = nacl.sign.keyPair.fromUnhashedSecretKey(camoPrivateKey0Bytes);
    expect(publicKeyFromUnhashedSecretKey0Bytes).to.deep.equal(publicKeyFromSecretKey0Bytes);
  });
  it('banano-nacl scalarMult.base vs scalarbase', async () => {
    /**
     * Banano/Nano hashes the private key before using it to derive a public key (nacl.js derivePublicFromSecret).
     * <p>
     * This makes it impossible to use that public key in generating a shared secret.
     * <p>
     * However, if we hash the private key, and used the hashed private key with the hashed public key it works.
     * <p>
     * Unfortunately, derivePublicFromSecret uses scalarbase, which returns different results than nacl.scalarMult.base,
     * so it's impossible to figure out how to use the two together withount deconstructing nacl.js)
     */
    const privateKey0Bytes = getPrivateKey0Bytes();
    const camoPrivateKey0Bytes = nacl.camo.hashsecret(privateKey0Bytes);
    const scalarbasePublicKey0Bytes = nacl.camo.scalarbase(camoPrivateKey0Bytes);
    const scalarMultBasePublicKey0Bytes = nacl.camo.scalarMult.base(camoPrivateKey0Bytes);
    expect(scalarbasePublicKey0Bytes).to.not.equal(scalarMultBasePublicKey0Bytes);
  });
  it('camo-nacl-public-key', async () => {
    const privateKey0 = bananoUtil.getPrivateKey(camoTestData.seed0, 0);
    const privateKeyF = bananoUtil.getPrivateKey(camoTestData.seedF, 0);

    const privateKey0Bytes = bananoUtil.hexToBytes(privateKey0);
    const privateKeyFBytes = bananoUtil.hexToBytes(privateKeyF);

    const camoPrivateKey0Bytes = nacl.camo.hashsecret(privateKey0Bytes);
    const camoPrivateKeyFBytes = nacl.camo.hashsecret(privateKeyFBytes);

    const camoPublicKey0Bytes = nacl.camo.scalarMult.base(camoPrivateKey0Bytes);
    const camoPublicKeyFBytes = nacl.camo.scalarMult.base(camoPrivateKeyFBytes);

    //        console.log( `privateKey0Bytes.length ${privateKey0Bytes.length}` );
    //        console.log( `privateKeyFBytes.length ${privateKeyFBytes.length}` );
    //        console.log( `camoPublicKey0Bytes.length ${camoPublicKey0Bytes.length}` );
    //        console.log( `camoPublicKeyFBytes.length ${camoPublicKeyFBytes.length}` );

    const secret0 = bananoUtil.bytesToHex(nacl.camo.scalarMult(camoPrivateKeyFBytes, camoPublicKey0Bytes));
    const secretF = bananoUtil.bytesToHex(nacl.camo.scalarMult(camoPrivateKey0Bytes, camoPublicKeyFBytes));

    expect(secret0).to.deep.equal(secretF);
  });
  it('camo-shared-secret-bytes', async () => {
    const privateKey0 = bananoUtil.getPrivateKey(camoTestData.seed0, 0);
    const privateKeyF = bananoUtil.getPrivateKey(camoTestData.seedF, 0);

    const privateKey0Bytes = bananoUtil.hexToBytes(privateKey0);
    const privateKeyFBytes = bananoUtil.hexToBytes(privateKeyF);

    const camoPublicKey0Bytes = camoUtil.getCamoPublicKeyBytes(privateKey0Bytes);
    const camoPublicKeyFBytes = camoUtil.getCamoPublicKeyBytes(privateKeyFBytes);

    const secret0FBytes = camoUtil.getSharedSecretBytes(privateKey0Bytes, camoPublicKeyFBytes);
    const secretF0Bytes = camoUtil.getSharedSecretBytes(privateKeyFBytes, camoPublicKey0Bytes);

    expect(secret0FBytes).to.deep.equal(secretF0Bytes);
  });
  it('camo-shared-secret', async () => {
    const privateKey0 = bananoUtil.getPrivateKey(camoTestData.seed0, 0);
    const publicKey0 = camoUtil.getCamoPublicKey(privateKey0);

    const privateKeyF = bananoUtil.getPrivateKey(camoTestData.seedF, 0);
    const publicKeyF = camoUtil.getCamoPublicKey(privateKeyF);


    expect(publicKeyF).to.deep.equal(camoTestData.seed0_camo_public);

    const secret0F = camoUtil.getSharedSecret(privateKey0, publicKeyF);
    const secretF0 = camoUtil.getSharedSecret(privateKeyF, publicKey0);

    expect(secret0F).to.deep.equal(secretF0);
  });
  it('camo-shared-seed', async () => {
    const privateKey0 = bananoUtil.getPrivateKey(camoTestData.seed0, 0);
    const publicKey0 = camoUtil.getCamoPublicKey(privateKey0);

    const privateKeyF = bananoUtil.getPrivateKey(camoTestData.seedF, 0);
    const publicKeyF = camoUtil.getCamoPublicKey(privateKeyF);

    const secret0F = camoUtil.getSharedSecret(privateKey0, publicKeyF);
    const secretF0 = camoUtil.getSharedSecret(privateKeyF, publicKey0);

    expect(secret0F).to.deep.equal(secretF0);

    const actualSharedSeed = bananoUtil.getPrivateKey(secret0F, 0);
    expect(actualSharedSeed).to.deep.equal(camoTestData.shared_seed);
  });
});
