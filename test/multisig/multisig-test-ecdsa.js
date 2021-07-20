'use strict';

// libraries
const chai = require('chai');
const elliptic = require('elliptic');
const crypto = require('crypto');
const bananojs = require('../../index.js');

// modules
const expect = chai.expect;
const ec = new elliptic.eddsa('ed25519');

// notes
// based on https://github.com/nanocurrency/nano-node/issues/462

// functions
const bytesToHex = bananojs.bananoUtil.bytesToHex;

const hexToBytes = bananojs.bananoUtil.hexToBytes;

// const getPublicKey = bananojs.bananoUtil.getPublicKey;

const getRandomBytes32Base16 = () => {
  return crypto.randomBytes(32).toString('hex').toUpperCase();
};

const getPublicKey = async (secret) => {
  // const bananoPublicKey = await bananojs.bananoUtil.getPublicKey(secret);
  // console.log('bananoPublicKey', bananoPublicKey);
  const key = ec.keyFromSecret(secret);
  const ecPublicKey = key.pubBytes();
  // console.log('ecPublicKey', bytesToHex(ecPublicKey));
  return bytesToHex(ecPublicKey);
};

const getMultiSigPublicKey = (A, B) => {
  const pubKeys = [A, B];
  const getAHashSignatureComponent = (publicKey, pubKeys) => {
  	const hashArguments = [publicKey];

  	for (let i = 0; i < pubKeys.length; i++) {
  		hashArguments.push(pubKeys[i]);
  	}

  	return ec.hashInt.apply(ec, hashArguments);
  };

  const getAggregatedPublicKeyPoint = (pubKeys) => {
  	let aggregatedPublicKeyPoint = null;

  	for (let i = 0; i < pubKeys.length; i++) {
      const pubKeyIPoint = ec.decodePoint(pubKeys[i]);
  		const aHashComponent = getAHashSignatureComponent(pubKeys[i], pubKeys);
  		const aggregationComponentPoint = pubKeyIPoint.mul(aHashComponent);

  		if (aggregatedPublicKeyPoint === null) {
  			aggregatedPublicKeyPoint = aggregationComponentPoint;
  		} else {
  			aggregatedPublicKeyPoint = aggregatedPublicKeyPoint.add(aggregationComponentPoint);
  		}
  	}
    // need to convert to key?
  	return aggregatedPublicKeyPoint;
  };

  const getAggregatedPublicKey = () => {
    const aggregatedPublicKeyPoint = getAggregatedPublicKeyPoint(pubKeys);
    return ec.keyFromPublic(aggregatedPublicKeyPoint);
  };

  const multiSigPublicKey = bytesToHex(getAggregatedPublicKey().pubBytes());
  console.log('getMultiSigPublicKey', multiSigPublicKey);
  return multiSigPublicKey;
};


const getRHash = (zValue, message) => {
  // const key = ec.keyFromSecret(secret);
  // const messagePrefix = key.messagePrefix();
  	const r = ec.hashInt(
      // messagePrefix,
      message, zValue);
  return r;
};

const getRPoint = (r) => {
  	const R = ec.g.mul(r);
  	const Rencoded = ec.encodePoint(R);
  	const t = ec.hashInt(Rencoded);
  return R;
};

const getAggregatedRPoint = (RPoints) => {
  	let aggregatedRPoint = null;

  	for (let i = 0; i < RPoints.length; i++) {
  		if (aggregatedRPoint === null) {
  			aggregatedRPoint = RPoints[i];
  		} else {
      // point addition
  			aggregatedRPoint = aggregatedRPoint.add(RPoints[i]);
  		}
  	}

  	return aggregatedRPoint;
};

const getAHashSignatureComponent = (publicKey, pubKeys) => {
  	const hashArguments = [publicKey];

  	for (let i = 0; i < pubKeys.length; i++) {
  		hashArguments.push(pubKeys[i]);
  	}

  	return ec.hashInt.apply(ec, hashArguments);
};

const getAggregatedPublicKeyPoint = (pubKeys) => {
  	let aggregatedPublicKeyPoint = null;
  	let aHashComponent = null;
  	let aggregationComponentPoint = null;

  	for (let i = 0; i < pubKeys.length; i++) {
    const pubKeyIPoint = ec.decodePoint(pubKeys[i]);
  		aHashComponent = getAHashSignatureComponent(pubKeys[i], pubKeys);
  		aggregationComponentPoint = pubKeyIPoint.mul(aHashComponent);

  		if (aggregatedPublicKeyPoint === null) {
  			aggregatedPublicKeyPoint = aggregationComponentPoint;
  		} else {
  			aggregatedPublicKeyPoint = aggregatedPublicKeyPoint.add(aggregationComponentPoint);
  		}
  	}
  // need to convert to key?
  	return aggregatedPublicKeyPoint;
};

const getAggregatedRPointFromMessage = (aZ, bZ, msgHashHex) => {
  const msgHash = Buffer.from(msgHashHex, 'hex');

  const aRHash = getRHash(aZ, msgHash);

  const bRHash = getRHash(bZ, msgHash);

  const aRPoint = getRPoint(aRHash);

  const bRPoint = getRPoint(bRHash);

  const aggregatedRPoint = getAggregatedRPoint([aRPoint, bRPoint]);
  return aggregatedRPoint;
};

const getSignaturePart = async (a, A, aZ, B, bZ, msgHashHex) => {
  const msgHash = Buffer.from(msgHashHex, 'hex');

  const aRHash = getRHash(aZ, msgHash);

  const bRHash = getRHash(bZ, msgHash);

  const aRPoint = getRPoint(aRHash);

  const bRPoint = getRPoint(bRHash);

  const aggregatedRPoint = getAggregatedRPoint([aRPoint, bRPoint]);

  const pubKeys = [A, B];

  const getSignatureContribution = async (aggregatedRPoint, pubKeys, message, secretKey, aRHash) => {
    const publicKey = await getPublicKey(secretKey);
    const aggregatedPublicKeyPoint = getAggregatedPublicKeyPoint(pubKeys);
    const aHashSignatureComponent = getAHashSignatureComponent(publicKey, pubKeys);
    const getKHash = (aggregatedRPoint, aggregatedPublicKeyPoint, message) => {
      return ec.hashInt(ec.encodePoint(aggregatedRPoint), ec.encodePoint(aggregatedPublicKeyPoint), message);
    };
    const kHash = getKHash(aggregatedRPoint, aggregatedPublicKeyPoint, message);
    const secretKeyBytes = ec.keyFromSecret(secretKey).privBytes();
    let signatureContribution = kHash.mul(ec.decodeInt(secretKeyBytes));

    // not absolutely certain about the order of operations here.
    signatureContribution = signatureContribution.mul(aHashSignatureComponent);

    // bigint addition
    signatureContribution = aRHash.add(signatureContribution);

    // appears to not be needed? Rust implementation doesn't seem to have it, even for single sig.
    signatureContribution = signatureContribution.umod(ec.curve.n);

    return signatureContribution;
  };

  const aSigContr = await getSignatureContribution(aggregatedRPoint, pubKeys, msgHash, a, aRHash);
  return aSigContr;
};

const getCombinedSignature = async (aggregatedRPoint, aSig, bSig) => {
  const signatureContributions = [aSig, bSig];
  let aggregatedSignature = null;

  for (let i = 0; i < signatureContributions.length; i++) {
    if (aggregatedSignature === null) {
      aggregatedSignature = signatureContributions[i];
    } else {
    // bigint addition
      aggregatedSignature = aggregatedSignature.add(signatureContributions[i]);
    }
  }

  return ec.makeSignature({R: aggregatedRPoint, S: aggregatedSignature, Rencoded: ec.encodePoint(aggregatedRPoint)}).toHex();
};

const getSignature = async (a, A, aZ, b, B, bZ, msgHashHex) => {
  const msgHash = Buffer.from(msgHashHex, 'hex');

  const getSignatureComponent = (secret, zValue, message) => {
    const key = ec.keyFromSecret(secret);
    const messagePrefix = key.messagePrefix();
  	const r = ec.hashInt(messagePrefix, message, zValue);
  	const R = ec.g.mul(r);
  	const Rencoded = ec.encodePoint(R);
  	const t = ec.hashInt(Rencoded);

  	return {rHash: r, RPoint: R};
  };

  const getAggregatedRPoint = (RPoints) => {
  	let aggregatedRPoint = null;

  	for (let i = 0; i < RPoints.length; i++) {
  		if (aggregatedRPoint === null) {
  			aggregatedRPoint = RPoints[i];
  		} else {
        // point addition
  			aggregatedRPoint = aggregatedRPoint.add(RPoints[i]);
  		}
  	}

  	return aggregatedRPoint;
  };

  const getAHashSignatureComponent = (publicKey, pubKeys) => {
  	const hashArguments = [publicKey];

  	for (let i = 0; i < pubKeys.length; i++) {
  		hashArguments.push(pubKeys[i]);
  	}

  	return ec.hashInt.apply(ec, hashArguments);
  };

  const getAggregatedPublicKeyPoint = (pubKeys) => {
  	let aggregatedPublicKeyPoint = null;
  	let aHashComponent = null;
  	let aggregationComponentPoint = null;

  	for (let i = 0; i < pubKeys.length; i++) {
      const pubKeyIPoint = ec.decodePoint(pubKeys[i]);
  		aHashComponent = getAHashSignatureComponent(pubKeys[i], pubKeys);
  		aggregationComponentPoint = pubKeyIPoint.mul(aHashComponent);

  		if (aggregatedPublicKeyPoint === null) {
  			aggregatedPublicKeyPoint = aggregationComponentPoint;
  		} else {
  			aggregatedPublicKeyPoint = aggregatedPublicKeyPoint.add(aggregationComponentPoint);
  		}
  	}
    // need to convert to key?
  	return aggregatedPublicKeyPoint;
  };

  const aSigComp = getSignatureComponent(a, aZ, msgHash);

  const bSigComp = getSignatureComponent(b, bZ, msgHash);

  const pubKeys = [A, B];

  const aggregatedRPoint = getAggregatedRPoint([aSigComp.RPoint, bSigComp.RPoint]);

  const getSignatureContribution = async (aggregatedRPoint, pubKeys, message, secretKey, signatureComponents) => {
    const publicKey = await getPublicKey(secretKey);
    const aggregatedPublicKeyPoint = getAggregatedPublicKeyPoint(pubKeys);
    const aHashSignatureComponent = getAHashSignatureComponent(publicKey, pubKeys);
    const getKHash = (aggregatedRPoint, aggregatedPublicKeyPoint, message) => {
      return ec.hashInt(ec.encodePoint(aggregatedRPoint), ec.encodePoint(aggregatedPublicKeyPoint), message);
    };
    const kHash = getKHash(aggregatedRPoint, aggregatedPublicKeyPoint, message);
    const secretKeyBytes = ec.keyFromSecret(secretKey).privBytes();
    let signatureContribution = kHash.mul(ec.decodeInt(secretKeyBytes));

    // not absolutely certain about the order of operations here.
    signatureContribution = signatureContribution.mul(aHashSignatureComponent);

    // bigint addition
    signatureContribution = signatureComponents.rHash.add(signatureContribution);

    // appears to not be needed? Rust implementation doesn't seem to have it, even for single sig.
    signatureContribution = signatureContribution.umod(ec.curve.n);

    return signatureContribution;
  };

  const aSigContr = await getSignatureContribution(aggregatedRPoint, pubKeys, msgHash, a, aSigComp);
  const bSigContr = await getSignatureContribution(aggregatedRPoint, pubKeys, msgHash, b, bSigComp);

  const getAggregatedSignature = (signatureContributions) => {
  	let aggregatedSignature = null;

  	for (let i = 0; i < signatureContributions.length; i++) {
  		if (aggregatedSignature === null) {
  			aggregatedSignature = signatureContributions[i];
  		} else {
        // bigint addition
  			aggregatedSignature = aggregatedSignature.add(signatureContributions[i]);
  		}
  	}

  	return ec.makeSignature({R: aggregatedRPoint, S: aggregatedSignature, Rencoded: ec.encodePoint(aggregatedRPoint)});
  };

  const aggregatedSignature = getAggregatedSignature([aSigContr, bSigContr], aggregatedRPoint);
  return aggregatedSignature.toHex();
};

const runTest = async (a, aZ, b, bZ, msgHash) => {
  // console.log('a', a.length, a);
  const A = await getPublicKey(a);
  // console.log('A', A.length, A);
  // const bananoA = await bananojs.bananoUtil.getPublicKey(a);
  // console.log('bananoA', bananoA.length, bananoA);
  const B = await getPublicKey(b);
  const multiSigPublicKey = getMultiSigPublicKey(A, B);

  const arp = getAggregatedRPointFromMessage(aZ, bZ, msgHash);
  const aSig = await getSignaturePart(a, A, aZ, B, bZ, msgHash);
  const bSig = await getSignaturePart(b, B, bZ, A, aZ, msgHash);
  // console.log('aSig', aSig.length, aSig);
  // console.log('bSig', bSig.length, bSig);

  const csignature = await getCombinedSignature(arp, aSig, bSig);
  console.log('csignature', csignature.length, csignature);
  const signature = await getSignature(a, A, aZ, b, B, bZ, msgHash);
  console.log('signature', signature.length, signature);
  const verified = ec.verify(msgHash, signature, multiSigPublicKey);
  // const verified = await bananojs.bananoUtil.verify(msgHash, signature, multiSigPublicKey);
  expect(true).to.deep.equal(verified);
};

describe('multisig', () => {
  describe('banano', async () => {
    it('zeroes', async () => {
      const a = '0000000000000000000000000000000000000000000000000000000000000000';
      const aZ = '0000000000000000000000000000000000000000000000000000000000000000';
      const b = '0000000000000000000000000000000000000000000000000000000000000000';
      const bZ = '0000000000000000000000000000000000000000000000000000000000000000';
      const msgHash = '000102030405060708090A';
      await runTest(a, aZ, b, bZ, msgHash);
    });
    it('example', async () => {
      const a = '31760bf21992fed876573423a3a1d4bffc41d692bb4f65f44ae21778f7fb941d';
      const aZ = 'c9b67f7c8830b7c5a8d28acd9edee6d7082a02d1b2c8b11392296ea2965879b9';
      const b = '6364c231f6d9755adf4960d7ed628b4e5e7a23ba2e191ff72df590fdf42383b9';
      const bZ = '7b9b11bc0f882c436540c00ae3a7f5c18adf83fca2caa93454b17a6706552c00';
      const msgHash = '000102030405060708090A';
      await runTest(a, aZ, b, bZ, msgHash);
    });
    it('random', async () => {
      const a = getRandomBytes32Base16();
      const aZ = getRandomBytes32Base16();
      const b = getRandomBytes32Base16();
      const bZ = getRandomBytes32Base16();
      const msgHash = getRandomBytes32Base16();
      await runTest(a, aZ, b, bZ, msgHash);
    });
  });
});
