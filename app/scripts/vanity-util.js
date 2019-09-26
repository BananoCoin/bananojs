const EC = require('elliptic').ec;
const ec = new EC('curve25519');

const bananoUtil = require( './banano-util.js' );

const addPublicKeys = (a0, b0) => {
  const aKey = ec.keyFromPublic(a0, 'hex');
  const bKey = ec.keyFromPublic(b0, 'hex');
  const a1= aKey.getPublic(true, 'hex').toUpperCase();
  const b1= bKey.getPublic(true, 'hex').toUpperCase();
  console.log('addPublicKeys', 'a', a0, a1, aKey.pub);
  console.log('addPublicKeys', 'b', b0, b1, bKey.pub);
  // const cKey = aKey.pub.add(bKey.pub);
  // const c1= cKey.getPublic(true, 'hex');
  // console.log('addPublicKeys', 'c', c0, c1);
  return a0;
};

const isSplitKeyVanity = (clientPublicKey, privateKeyBytes, vanityRegex) => {
  const privateKey = bananoUtil.bytesToHex(privateKeyBytes);
  const rawPublicKey = bananoUtil.getPublicKey(privateKey);
  const publicKey = addPublicKeys(rawPublicKey, clientPublicKey);
  const account = bananoUtil.getAccount(publicKey);
  const isSplitKeyVanityFlag = vanityRegex.test(account);
  // console.log('isSplitKeyVanity',
  //     'account', account,
  //     'vanityRegex', vanityRegex,
  //     'isSplitKeyVanityFlag', isSplitKeyVanityFlag
  // );
  return isSplitKeyVanityFlag;
};

const generateSplitKeyVanity = (clientPublicKey, vanityRegexStr) => {
  const vanityRegex = new RegExp(vanityRegexStr);
  const privateKeyBytes = new Uint8Array(32);
  let isSplitKeyVanityFlag = isSplitKeyVanity(clientPublicKey, privateKeyBytes, vanityRegex);
  while (!isSplitKeyVanityFlag) {
    bananoUtil.incrementBytes(privateKeyBytes);
    isSplitKeyVanityFlag = isSplitKeyVanity(clientPublicKey, privateKeyBytes, vanityRegex);
  }
  const privateKey = bananoUtil.bytesToHex(privateKeyBytes);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const splitKeyVanity = {};
  splitKeyVanity.privateKey = privateKey;
  splitKeyVanity.account = account;
  return splitKeyVanity;
};

exports.generateSplitKeyVanity = generateSplitKeyVanity;
