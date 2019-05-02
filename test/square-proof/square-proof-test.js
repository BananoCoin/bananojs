const assert = require('chai').assert;
const expect = require('chai').expect;

const nacl = require('../../libraries/tweetnacl/nacl.js');

const sharedSecretMult = BigInt('103');

const sharedSecretMultSquared = sharedSecretMult * sharedSecretMult;

const sharedSecretMod = BigInt('107');

// console.log('multiplier', sharedSecretMult);
// console.log('modulus', sharedSecretMod);

const ZERO = BigInt('0');

const getSumOfSquares = (x) => {
  if (x === undefined) {
    throw Error('x is a required parameter.');
  }
  return (x[0] * x[0]) + (x[1] * x[1]) + (x[2] * x[2]) + (x[3] * x[3]);
};

const getSquares = (amount) => {
  if (amount === undefined) {
    throw Error('amount is a required parameter.');
  }
  const x = [];

  // console.log('getSquares amount', amount);

  for (x[0] = ZERO; x[0] <= amount; x[0]++) {
    for (x[1] = ZERO; x[1] <= amount; x[1]++) {
      for (x[2] = ZERO; x[2] <= amount; x[2]++) {
        for (x[3] = ZERO; x[3] <= amount; x[3]++) {
          // console.log('getSquares x', x, getSumOfSquares(x), amount);
          if (getSumOfSquares(x) == amount) {
            // console.log('getSquares x', x, getSumOfSquares(x), amount);
            return x;
          }
        }
      }
    }
  }
  throw Error(`cannot find sum of squares for ${amount} ${x}`);
};

const encrypt = (decryptedAmount) => {
  if (decryptedAmount === undefined) {
    throw Error('decryptedAmount is a required parameter.');
  }
  // console.log('encrypt decryptedAmount', decryptedAmount);
  const squares = getSquares(decryptedAmount);
  // console.log('encrypt squares', squares);

  const encryptEach = (decryptedAmountEach) => {
    return (decryptedAmountEach * sharedSecretMultSquared) % sharedSecretMod;
  };

  const encryptedSquares = squares.map(encryptEach);
  // console.log('encrypt encryptedSquares', encryptedSquares);
  return encryptedSquares;
};

const encryptTx = (tx) => {
  if (tx === undefined) {
    throw Error('tx is a required parameter.');
  }
  const encryptedTx = {};
  encryptedTx.sourceOriginalBalance = encrypt(tx.sourceOriginalBalance);
  encryptedTx.destOriginalBalance = encrypt(tx.destOriginalBalance);
  encryptedTx.amount = encrypt(tx.amount);
  // console.log('tx', `${tx.sourceOriginalBalance}=${tx.destOriginalBalance}+${tx.amount}`);
  // console.log('encryptedTx', `[${encryptedTx.sourceOriginalBalance}]=[${encryptedTx.destOriginalBalance}]+[${encryptedTx.amount}]`);
  return encryptedTx;
};

const isAmountSquare = (amount) => {
  for (let x = ZERO; x <= amount; x++) {
    if ((x * x) == amount) {
      return true;
    }
  }
  return false;
};

const isAmountSquares = (amounts) => {
  // console.log('isAmountSquares', amounts);
  let allSquares = true;
  for (let x = 0; x < amounts.length; x++) {
    const amount = amounts[x];
    // console.log(`isAmountSquare[${x}] amount`, amount);
    if (!isAmountSquare(amount)) {
      // console.log('isAmountSquare false', amount);
      allSquares = false;
    }
  }
  return allSquares;
};

const isTxSquares = (tx) => {
  let allSquares = true;
  if (!isAmountSquares(tx.sourceOriginalBalance)) {
    allSquares = false;
  }
  if (!isAmountSquares(tx.destOriginalBalance)) {
    allSquares = false;
  }
  if (!isAmountSquares(tx.amount)) {
    allSquares = false;
  }
  return allSquares;
};

const isTxBalanced = (tx) => {
  if (tx === undefined) {
    throw Error('tx is a required parameter.');
  }
  const sourceOriginalBalance = getSumOfSquares(tx.sourceOriginalBalance);
  const destOriginalBalance = getSumOfSquares(tx.destOriginalBalance);
  const amount = getSumOfSquares(tx.amount);
  const leftSide = sourceOriginalBalance % sharedSecretMod;
  const rightSide = (destOriginalBalance + amount) % sharedSecretMod;
  // console.log('leftSide', leftSide);
  // console.log('rightSide', rightSide);
  return leftSide == rightSide;
};

describe.skip('square-proof', () => {
  it('check sum of squares', () => {
    for (let x = BigInt(0); x < sharedSecretMod; x++) {
      // console.log('x', x);
      const squares = getSquares(x);
      // console.log('squares', squares);
      const sum = getSumOfSquares(squares);
      // console.log('sum', sum.toString());
      expect(x.toString()).to.equal(sum.toString());
    }
  });
  it('transfer 1 from 1 to 0', () => {
    const tx = {};
    tx.sourceOriginalBalance = BigInt('1');
    tx.destOriginalBalance = BigInt('0');
    tx.amount = BigInt('1');

    const encryptedTx = encryptTx(tx);
    const isTxBalancedFlag = isTxBalanced(encryptedTx);
    expect(isTxBalancedFlag).to.equal(true);
    const isTxSquaresFlag = isTxSquares(encryptedTx);
    expect(isTxSquaresFlag).to.equal(true);
  });
  it('transfer -1 from 1 to 0', () => {
    const tx = {};
    tx.sourceOriginalBalance = BigInt('1');
    tx.destOriginalBalance = BigInt('0');
    tx.amount = sharedSecretMod + BigInt('1');

    const encryptedTx = encryptTx(tx);
    const isTxBalancedFlag = isTxBalanced(encryptedTx);
    expect(isTxBalancedFlag).to.equal(true);
    const isTxSquaresFlag = isTxSquares(encryptedTx);
    expect(isTxSquaresFlag).to.equal(false);
  });
});
