const assert = require('chai').assert;
const expect = require('chai').expect;

const nacl = require('../../libraries/tweetnacl/nacl.js');

const camoUtil = require('../../app/scripts/camo-util.js');

const bananoUtil = require('../../app/scripts/banano-util.js');

const squareProofTestData = require('./square-proof-test-data.json');

const ZERO = BigInt('0');

/**
 * the idea of square proofs is to create a range proof that is at most 4x as large as the value being proven.
 <p>
 * the scenario:<br>
 * 'sssq' is short for 'shared secret between two private keys, squared', which is used several times below.
 <p>
 * seed0 has 1000 ban. It is stored encrypted, multiplied by sssq(privateKey0,privateKey0)<br>
 * seedF has 1000 ban. It is stored encrypted, multiplied by sssq(privateKeyF,privateKeyF)<br>
 * seed0 wants to transfer 10 ban to seedF.<br>
 * <p>
 * the blockchain has two problems then.<br>
 * 1) to create the send block it needs to confirm that (1000*sssq(0,0))=(990*sssq(0,0))+(10*sssq(0,F))
 * 2) to create the receive block it needs to confirm that (1010*sssq(F,F))=(1000*sssq(F,F))+(10*sssq(0,F))
 */

const getSharedSecret = (privateKey0, privateKeyF) => {
  const publicKey0 = bananoUtil.getPublicKey(privateKey0);
  const secretF0 = camoUtil.getSharedSecret(privateKeyF, publicKey0);
  return BigInt('0x' + secretF0);
};

const getSharedSecret0F = () => {
  const sharedSecret = getSharedSecret(squareProofTestData.privateKey0, squareProofTestData.privateKeyF);
  console.log('getSharedSecret0F', sharedSecret);
  return sharedSecret;
};

const getSharedSecret00 = () => {
  const sharedSecret = getSharedSecret(squareProofTestData.privateKey0, squareProofTestData.privateKey0);
  console.log('getSharedSecret00', sharedSecret);
  return sharedSecret;
};

const getSharedSecretFF = () => {
  const sharedSecret = getSharedSecret(squareProofTestData.privateKeyF, squareProofTestData.privateKeyF);
  console.log('getSharedSecretFF', sharedSecret);
  return sharedSecret;
};

const getEncryptedOriginalBalance0 = () => {
  return BigInt(squareProofTestData.privateKey0prevBalance) * getSharedSecret00();
};

const getEncryptedNewBalance0 = () => {
  return (BigInt(squareProofTestData.privateKey0prevBalance) - BigInt(squareProofTestData.amount)) * getSharedSecret00();
};

const getEncryptedAmount = () => {
  return BigInt(squareProofTestData.amount) * getSharedSecret0F();
};

const getEncryptedOriginalBalanceF = () => {
  return BigInt(squareProofTestData.privateKeyFprevBalance) * getSharedSecretFF();
};

const getEncryptedNewBalanceF = () => {
  return (BigInt(squareProofTestData.privateKeyFprevBalance) + BigInt(squareProofTestData.amount)) * getSharedSecretFF();
};

describe('square-proof-key', () => {
  it(`transfer ${squareProofTestData.amount} from 0 to F`, () => {
    const tx = {};
    tx.sourceOriginalBalance = getEncryptedOriginalBalance0();
    tx.sourceNewBalance = getEncryptedNewBalance0();
    tx.destOriginalBalance = getEncryptedOriginalBalanceF();
    tx.destNewlBalance = getEncryptedNewBalanceF();
    tx.amount = getEncryptedAmount();

    const sendBlockLeftSide = (tx.sourceOriginalBalance * getSharedSecret0F());
    const sendBlockRightSide = (tx.sourceNewBalance * getSharedSecret0F()) + (tx.amount * getSharedSecret00());
    expect(sendBlockLeftSide.toString()).to.equal(sendBlockRightSide.toString());

    const recieveBlockLeftSide = (tx.destNewlBalance * getSharedSecret0F());
    const recieveBlockRightSide = (tx.destNewlBalance * getSharedSecret0F()) + (tx.amount * getSharedSecretFF());
    expect(sendBlockLeftSide.toString()).to.equal(sendBlockRightSide.toString());
  });
});
