const nacl = require( '../../libraries/tweetnacl/nacl.js' );

const bananoUtil = require( './banano-util.js' );

// const getRandomHex32 = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

const isSplitKeyVanity = (privateKeyBytes, vanityRegex) => {
  const privateKey = bananoUtil.bytesToHex(privateKeyBytes);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const isSplitKeyVanityFlag = vanityRegex.test(account);
  // console.log('isSplitKeyVanity',
  //     'account', account,
  //     'vanityRegex', vanityRegex,
  //     'isSplitKeyVanityFlag', isSplitKeyVanityFlag
  // );
  return isSplitKeyVanityFlag;
};

const generateSplitKeyVanity = (secretPublicKey, vanityRegexStr) => {
  const vanityRegex = new RegExp(vanityRegexStr);
  const privateKeyBytes = new Uint8Array(32);
  let isSplitKeyVanityFlag = isSplitKeyVanity(privateKeyBytes, vanityRegex);
  while (!isSplitKeyVanityFlag) {
    bananoUtil.incrementBytes(privateKeyBytes);
    isSplitKeyVanityFlag = isSplitKeyVanity(privateKeyBytes, vanityRegex);
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
