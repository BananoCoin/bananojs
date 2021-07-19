const elliptic = require('elliptic');

let EdDSA = elliptic.eddsa;
// Create and initialize EdDSA context
// (better do it once and reuse it)
let ec = new EdDSA('ed25519');

function getPlayerData(secret, zValue) {
	let key = ec.keyFromSecret(secret); // hex string, array or Buffer

	return {
		'secretKeyBytes': key.privBytes(),
		'publicKeyBytes': key.pubBytes(),
		'publicKeyPoint': ec.decodePoint(key.pubBytes()),
		'messagePrefix': key.messagePrefix(),
		'zValue': zValue
	};
}

function getSignatureComponentsForPlayer(playerData, message) {
	let r = ec.hashInt(playerData.messagePrefix, message, playerData.zValue);
	let R = ec.g.mul(r);
	let Rencoded = ec.encodePoint(R);
	let t = ec.hashInt(Rencoded);

	return {
		'rHash': r,
		'RPoint': R,
		'RPointCommitment': t
	};
}

function getAggregatedRPoint(RPoints) {
	let aggregatedRPoint = null;

	for (let i = 0; i < RPoints.length; i++) {
		if (aggregatedRPoint === null) {
			aggregatedRPoint = RPoints[i];
		} else {
			aggregatedRPoint = aggregatedRPoint.add(RPoints[i]); // point addition
		}
	}

	return aggregatedRPoint;
}

function getAHashSignatureComponent(playerPublicKeyPoint, pubKeys) {
	let hashArguments = [ec.encodePoint(playerPublicKeyPoint)];

	for (let i = 0; i < pubKeys.length; i++) {
		hashArguments.push(ec.encodePoint(pubKeys[i]));
	}

	return ec.hashInt.apply(ec, hashArguments);
}

function getAggregatedPublicKeyPoint(pubKeys) {
	let aggregatedPublicKeyPoint = null;
	let aHashComponent = null;
	let aggregationComponentPoint = null;

	for (let i = 0; i < pubKeys.length; i++) {
		aHashComponent = getAHashSignatureComponent(pubKeys[i], pubKeys);
		aggregationComponentPoint = pubKeys[i].mul(aHashComponent);

		if (aggregatedPublicKeyPoint === null) {
			aggregatedPublicKeyPoint = aggregationComponentPoint;
		} else {
			aggregatedPublicKeyPoint = aggregatedPublicKeyPoint.add(aggregationComponentPoint);
		}
	}

	return aggregatedPublicKeyPoint; // need to convert to key?
}

function getKHash(aggregatedRPoint, aggregatedPublicKeyPoint, message) {
	return ec.hashInt(ec.encodePoint(aggregatedRPoint), ec.encodePoint(aggregatedPublicKeyPoint), message);
}

function getSignatureContribution(aggregatedRPoint, pubKeys, message, playerData, signatureComponents) {
	let aggregatedPublicKeyPoint = getAggregatedPublicKeyPoint(pubKeys);
	let aHashSignatureComponent = getAHashSignatureComponent(playerData['publicKeyPoint'], pubKeys);
	let kHash = getKHash(aggregatedRPoint, aggregatedPublicKeyPoint, message);

	let signatureContribution = kHash.mul(ec.decodeInt(playerData['secretKeyBytes']));
	signatureContribution = signatureContribution.mul(aHashSignatureComponent); // not absolutely certain about the order of operations here.
	signatureContribution = signatureComponents['rHash'].add(signatureContribution); // bigint addition
	signatureContribution = signatureContribution.umod(ec.curve.n); // appears to not be needed? Rust implementation doesn't seem to have it, even for single sig.

	return signatureContribution;
}

function getAggregatedSignature(signatureContributions) {
	let aggregatedSignature = null;

	for (let i = 0; i < signatureContributions.length; i++) {
		if (aggregatedSignature === null) {
			aggregatedSignature = signatureContributions[i];
		} else {
			aggregatedSignature = aggregatedSignature.add(signatureContributions[i]); // bigint addition
		}
	}

	return ec.makeSignature({ R: aggregatedRPoint, S: aggregatedSignature, Rencoded: ec.encodePoint(aggregatedRPoint) });
}

let msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

let playerData1 = getPlayerData('31760bf21992fed876573423a3a1d4bffc41d692bb4f65f44ae21778f7fb941d', 'c9b67f7c8830b7c5a8d28acd9edee6d7082a02d1b2c8b11392296ea2965879b9')
let signatureComponents1 = getSignatureComponentsForPlayer(playerData1, msgHash);

let playerData2 = getPlayerData('6364c231f6d9755adf4960d7ed628b4e5e7a23ba2e191ff72df590fdf42383b9', '7b9b11bc0f882c436540c00ae3a7f5c18adf83fca2caa93454b17a6706552c00')
let signatureComponents2 = getSignatureComponentsForPlayer(playerData2, msgHash);

// when the second player's data is uncommented, verification fails

let pubKeys = [
	playerData1.publicKeyPoint,
	playerData2.publicKeyPoint
];

let RPoints = [
	signatureComponents1.RPoint,
	signatureComponents2.RPoint
];

let aggregatedRPoint = getAggregatedRPoint(RPoints);
let signatureContribution1 = getSignatureContribution(aggregatedRPoint, pubKeys, msgHash, playerData1, signatureComponents1);
let signatureContribution2 = getSignatureContribution(aggregatedRPoint, pubKeys, msgHash, playerData2, signatureComponents2);

let signatureContributions = [
	signatureContribution1,
	signatureContribution2
];

let aggregatedSignature = getAggregatedSignature(signatureContributions, aggregatedRPoint);

// console.log(aggregatedSignature);

let aggregatedPublicKeyPoint = getAggregatedPublicKeyPoint(pubKeys);
let aggPubKey = ec.keyFromPublic(aggregatedPublicKeyPoint);
console.log('Attempting to verify aggregated signature...');
// console.log('Verification Passed: ' + ec.verify(msgHash, aggregatedSignature, aggregatedPublicKeyPoint));
console.log('Verification Passed: ' + ec.verify(msgHash, aggregatedSignature, aggPubKey));
