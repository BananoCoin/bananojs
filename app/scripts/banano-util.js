'use strict';

// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
// istanbul ignore if
  if (typeof BigInt === 'undefined') {
    return;
  }
  const blake = require('../../libraries/blake2b/blake2b.js');

  const nacl = require('../../libraries/tweetnacl/nacl.js');

  const workMin = BigInt('0xfffffe0000000000');

  const preamble = '0000000000000000000000000000000000000000000000000000000000000006';

  const prefixDivisors = {
    'ban_': {
      minorDivisor: BigInt('1000000000000000000000000000'),
      majorDivisor: BigInt('100000000000000000000000000000'),
      majorName: 'banano',
      minorName: 'banoshi',
    },
    'nano_': {
      minorDivisor: BigInt('1000000000000000000000000'),
      majorDivisor: BigInt('1000000000000000000000000000000'),
      majorName: 'nano',
      minorName: 'nanoshi',
    },
  };

  const ACCOUNT_ALPHABET_REGEX_STR = '^[13456789abcdefghijkmnopqrstuwxyz]+$';

  const SEED_ALPHABET_REGEX_STR = '^[0123456789abcdefABCDEF]{64}$';

  const LOG_SEND = false;

  const LOG_SEND_PROCESS = false;

  const LOG_RECEIVE = false;

  const LOG_OPEN = false;

  const LOG_CHANGE = false;

  const LOG_IS_WORK_VALID = false;

  const LOG_GET_HASH_CPU_WORKER = false;

  /**
 * Converts an amount into a raw amount.
 *
 * @memberof BananoUtil
 * @param {string} amountStr the amount, as a string.
 * @param {string} amountPrefix the amount, as a string.
 * @return {string} the banano as a raw value.
 */
  const getRawStrFromMajorAmountStr = (amountStr, amountPrefix) => {
  /* istanbul ignore if */
    if (amountStr == undefined) {
      throw Error( 'amountStr is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    /* istanbul ignore if */
    if (typeof amountStr !== 'string') {
      throw Error(`'${amountStr}' is not a string.`);
    }
    const decimalPlace = amountStr.indexOf('.');
    let divisor = BigInt('1');
    // console.log('STARTED getRawStrFromAmountStr', bananoStr, decimalPlace, divisor);
    if (decimalPlace !== -1) {
      amountStr = amountStr.replace('.', '');
      const decimalsAfter = amountStr.length - decimalPlace;
      // console.log('INTERIM getRawStrFromAmountStr decimalsAfter', decimalsAfter);
      divisor = BigInt('10') ** BigInt(decimalsAfter);
    }
    // console.log('INTERIM getRawStrFromAmountStr', bananoStr, decimalPlace, divisor);
    const amountBi = BigInt(amountStr);
    // console.log('INTERIM getRawStrFromAmountStr banano   ', banano);
    // console.log('INTERIM getRawStrFromAmountStr bananoDiv', majorDivisor);

    /* istanbul ignore if */
    if (prefixDivisors[amountPrefix] == undefined) {
      throw Error(`'${amountPrefix}' is not an amountPrefix. (${[...Object.keys(prefixDivisors)]})`);
    }
    const majorDivisor = prefixDivisors[amountPrefix].majorDivisor;

    const amountRaw = (amountBi * majorDivisor) / divisor;
    // console.log('INTERIM getRawStrFromAmountStr bananoRaw', bananoRaw);
    // const parts = getAmountPartsFromRaw(bananoRaw.toString());
    // console.log('SUCCESS getRawStrFromAmountStr', bananoStr, bananoRaw, parts);
    return amountRaw.toString();
  };

  /**
 * Converts a banoshi amount into a raw amount.
 *
 * @memberof BananoUtil
 * @param {string} amountStr the banoshi, as a string.
 * @param {string} amountPrefix the amount prefix, as a string.
 * @return {string} the banano as a raw value.
 */
  const getRawStrFromMinorAmountStr = (amountStr, amountPrefix) => {
  /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const amount = BigInt(amountStr);
    const prefixDivisor = prefixDivisors[amountPrefix];
    const minorDivisor = prefixDivisor.minorDivisor;
    const amountRaw = amount * minorDivisor;
    return amountRaw.toString();
  };

  /**
 * @typedef {Object} BananoParts
 * @property {string} banano - The amount of banano.
 * @property {string} banoshi - The amount of banoshi (not counting whole banano).
 * @property {string} raw - The amount of raw (not counting whole banano and whole banoshi).
 */

  /**
   * Get the banano parts (banano, banoshi, raw) for a given raw value.
   *
   * @memberof BananoUtil
   * @param {string} amountRawStr the raw amount, as a string.
   * @param {string} amountPrefix the amount prefix, as a string.
   * @return {BananoParts} the banano parts.
   */
  const getAmountPartsFromRaw = (amountRawStr, amountPrefix) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const amountRaw = BigInt(amountRawStr);
    //    console.log(`bananoRaw:    ${bananoRaw}`);
    const prefixDivisor = prefixDivisors[amountPrefix];
    const majorDivisor = prefixDivisor.majorDivisor;
    const minorDivisor = prefixDivisor.minorDivisor;
    //    console.log(`bananoDivisor:   ${bananoDivisor}`);
    const major = amountRaw / majorDivisor;
    //    console.log(`banano:${banano}`);
    const majorRawRemainder = amountRaw - (major * majorDivisor);
    const minor = majorRawRemainder / minorDivisor;
    const amountRawRemainder = majorRawRemainder - (minor * minorDivisor);

    const bananoParts = {};
    bananoParts.majorName = prefixDivisor.majorName;
    bananoParts.minorName = prefixDivisor.minorName;
    bananoParts[prefixDivisor.majorName] = major.toString();
    bananoParts[prefixDivisor.minorName] = minor.toString();
    bananoParts.raw = amountRawRemainder.toString();
    return bananoParts;
  };

  const hexToBytes = (hex) => {
    const ret = new Uint8Array(hex.length / 2);
    for (let i = 0; i < ret.length; i++) {
      ret[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return ret;
  };

  const bytesToHex = (bytes) => {
    return Array.prototype.map.call(bytes, (x) => ('00' + x.toString(16)).slice(-2)).join('').toUpperCase();
  };

  const hash = (block) => {
  /* istanbul ignore if */
    if (block === undefined) {
      throw Error('block is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.account === undefined) {
      throw Error('block.account is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.previous === undefined) {
      throw Error('block.previous is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.representative === undefined) {
      throw Error('block.representative is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.balance === undefined) {
      throw Error('block.balance is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.link === undefined) {
      throw Error('block.link is a required parameter.');
    }
    const context = blake.blake2bInit(32, null);
    blake.blake2bUpdate(context, hexToBytes(preamble));
    blake.blake2bUpdate(context, hexToBytes(getAccountPublicKey(block.account)));
    blake.blake2bUpdate(context, hexToBytes(block.previous));
    blake.blake2bUpdate(context, hexToBytes(getAccountPublicKey(block.representative)));

    // console.log( `block.balance:${block.balance}` );
    let balanceToPad = BigInt(block.balance).toString(16);
    // console.log( `pre  balanceToPad:${balanceToPad}` );
    while (balanceToPad.length < 32) {
      balanceToPad = '0' + balanceToPad;
    }
    // console.log( `post balanceToPad:${balanceToPad}` );
    const balance = hexToBytes(balanceToPad);
    // console.log( `balance:${balance}` );
    blake.blake2bUpdate(context, balance);
    blake.blake2bUpdate(context, hexToBytes(block.link));
    const hash = bytesToHex(blake.blake2bFinal(context));
    return hash;
  };

  const uint5ToUint4 = (uint5) => {
    const length = uint5.length / 4 * 5;
    const uint4 = new Uint8Array(length);
    for (let i = 1; i <= length; i++) {
      const n = i - 1;
      const m = i % 5;
      const z = n - ((i - m) / 5);
      const right = uint5[z - 1] << (5 - m);
      const left = uint5[z] >> m;
      uint4[n] = (left + right) % 16;
    }
    return uint4;
  };

  const arrayCrop = (array) => {
    const length = array.length - 1;
    const croppedArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      croppedArray[i] = array[i + 1];
    }
    return croppedArray;
  };

  const uint4ToHex = (uint4) => {
    let hex = '';
    for (let i = 0; i < uint4.length; i++) {
      hex += uint4[i].toString(16).toUpperCase();
    }
    return hex;
  };

  const uint8ToUint4 = (uintValue) => {
    const uint4 = new Uint8Array(uintValue.length * 2);
    for (let i = 0; i < uintValue.length; i++) {
      uint4[i * 2] = uintValue[i] / 16 | 0;
      uint4[i * 2 + 1] = uintValue[i] % 16;
    }

    return uint4;
  };

  const equalArrays = (array1, array2) => {
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] != array2[i]) return false;
    }
    return true;
  };

  const uint4ToUint8 = (uintValue) => {
    const length = uintValue.length / 2;
    const uint8 = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8[i] = (uintValue[i * 2] * 16) + uintValue[i * 2 + 1];
    }

    return uint8;
  };

  const stringToUint5 = (string) => {
    const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
    const length = string.length;
    const stringArray = string.split('');
    const uint5 = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint5[i] = letterList.indexOf(stringArray[i]);
    }
    return uint5;
  };

  const isAccountSuffixValid = (accountSuffix) => {
    const regex = new RegExp(ACCOUNT_ALPHABET_REGEX_STR);
    const isValid = regex.test(accountSuffix);
    const retval = {};
    retval.valid = isValid;
    if (isValid) {
      retval.message = '';
    } else {
      retval.message = `does not match regex '${ACCOUNT_ALPHABET_REGEX_STR}'`;
    }
    return retval;
  };

  /**
 * Get the public key for a given account.
 *
 * @memberof BananoUtil
 * @param {string} account the account.
 * @return {string} the public key.
 */
  const getAccountPublicKey = (account) => {
    if (account === undefined) {
      throw Error(`Undefined BANANO Account`);
    }
    if (account.startsWith === undefined) {
      throw Error(`Not a string: '${account}'`);
    }
    let accountCrop;
    if (account.startsWith('camo')) {
      if (((!account.startsWith('camo_1')) &&
        (!account.startsWith('camo_3'))) ||
        (account.length !== 65)) {
        throw Error(`Invalid CAMO BANANO Account prefix '${account}'`);
      }
      accountCrop = account.substring(5, 65);
    } else if (account.startsWith('nano')) {
      if (((!account.startsWith('nano_1')) &&
        (!account.startsWith('nano_3'))) ||
        (account.length !== 65)) {
        throw Error(`Invalid NANO Account prefix '${account}'`);
      }
      accountCrop = account.substring(5, 65);
    } else {
      if (((!account.startsWith('ban_1')) &&
        (!account.startsWith('ban_3'))) ||
        (account.length !== 64)) {
        throw Error(`Invalid BANANO Account prefix '${account}'`);
      }
      accountCrop = account.substring(4, 64);
    }
    const isAccountValid = isAccountSuffixValid(accountCrop);
    if (!isAccountValid.valid) {
      throw Error(`Invalid BANANO Account '${account}', ${isAccountValid.message}`);
    }

    const keyUint4 = arrayCrop(uint5ToUint4(stringToUint5(accountCrop.substring(0, 52))));
    const hashUint4 = uint5ToUint4(stringToUint5(accountCrop.substring(52, 60)));
    const keyArray = uint4ToUint8(keyUint4);
    const blakeHash = blake.blake2b(keyArray, null, 5).reverse();

    const left = hashUint4;
    const right = uint8ToUint4(blakeHash);
    if (!equalArrays(left, right)) {
      const leftStr = uint5ToString(uint4ToUint5(left));
      const rightStr = uint5ToString(uint4ToUint5(right));

      throw Error(`Incorrect checksum ${leftStr} <> ${rightStr}`);
    }

    return uint4ToHex(keyUint4);
  };

  const hexToUint8 = (hexValue) => {
    const length = (hexValue.length / 2) | 0;
    const uint8 = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);
    }
    return uint8;
  };

  const decToHex = (decValue, bytes = null) => {
    const dec = decValue.toString().split('');
    const sum = [];
    let hex = '';
    const hexArray = [];
    let i; let s;
    while (dec.length) {
      s = 1 * dec.shift();
      for (i = 0; s || i < sum.length; i++) {
        s += (sum[i] || 0) * 10;
        sum[i] = s % 16;
        s = (s - sum[i]) / 16;
      }
    }
    while (sum.length) {
      hexArray.push(sum.pop().toString(16));
    }

    hex = hexArray.join('');

    if (hex.length % 2 != 0) {
      hex = '0' + hex;
    }

    if (bytes > hex.length / 2) {
      const diff = bytes - hex.length / 2;
      for (let j = 0; j < diff; j++) {
        hex = '00' + hex;
      }
    }

    return hex;
  };


  const generateAccountSecretKeyBytes = (seedBytes, accountIndex) => {
    const accountBytes = hexToUint8(decToHex(accountIndex, 4));
    const context = blake.blake2bInit(32);
    blake.blake2bUpdate(context, seedBytes);
    blake.blake2bUpdate(context, accountBytes);
    const newKey = blake.blake2bFinal(context);
    return newKey;
  };

  const uint4ToUint5 = (uintValue) => {
    const length = uintValue.length / 5 * 4;
    const uint5 = new Uint8Array(length);
    for (let i = 1; i <= length; i++) {
      const n = i - 1;
      const m = i % 4;
      const z = n + ((i - m) / 4);
      const right = uintValue[z] << m;
      let left;
      if (((length - i) % 4) == 0) {
        left = uintValue[z - 1] << 4;
      } else {
        left = uintValue[z + 1] >> (4 - m);
      }
      uint5[n] = (left + right) % 32;
    }
    return uint5;
  };


  /**
   * Get the account suffix for a given public key (everything but ban_ or camo_ or nano_).
   *
   * @memberof BananoUtil
   * @param {string} publicKey the public key.
   * @return {string} the account suffix.
   */
  const getAccountSuffix = (publicKey) => {
    const keyBytes = uint4ToUint8(hexToUint4(publicKey)); // For some reason here we go from u, to hex, to 4, to 8??
    const checksum = uint5ToString(uint4ToUint5(uint8ToUint4(blake.blake2b(keyBytes, null, 5).reverse())));
    const account = uint5ToString(uint4ToUint5(hexToUint4(`0${publicKey}`)));
    return `${account}${checksum}`;
  };

  /**
   * Get the account for a given public key.
   *
   * @memberof BananoUtil
   * @param {string} publicKey the public key.
   * @param {string} accountPrefix the prefix. ban_ or nano_.
   * @return {string} the account.
   */
  const getAccount = (publicKey, accountPrefix) => {
    /* istanbul ignore if */
    if (accountPrefix == undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    const accountSuffix = getAccountSuffix(publicKey);
    return `${accountPrefix}${accountSuffix}`;
  };

  const uint5ToString = (uint5) => {
    const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
    let string = '';
    for (let i = 0; i < uint5.length; i++) {
      string += letterList[uint5[i]];
    }

    return string;
  };

  const hexToUint4 = (hexValue) => {
    const uint4 = new Uint8Array(hexValue.length);
    for (let i = 0; i < hexValue.length; i++) {
      uint4[i] = parseInt(hexValue.substr(i, 1), 16);
    }

    return uint4;
  };

  const signHash = (privateKey, hash) => {
  //    console.log( `sign ${JSON.stringify( block )}` );
    const hashBytes = hexToBytes(hash);
    //    console.log( `hashBytes[${hashBytes.length}]:${hashBytes}` );

    const privateKeyBytes = hexToBytes(privateKey);
    //    console.log( `privateKeyBytes[${privateKeyBytes.length}]:${privateKeyBytes}` );

    const signed = nacl.sign.detached(hashBytes, privateKeyBytes);
    const signature = bytesToHex(signed);
    return signature;
  };

  const verify = (hash, signature, publicKey) => {
    const hashBytes = hexToBytes(hash);
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);
    return nacl.sign.detached.verify(hashBytes, signatureBytes, publicKeyBytes);
  };

  const sign = async (privateKey, block) => {
    if (typeof privateKey == 'object') {
      const hwResponse = await privateKey.signBlock(block);
      return hwResponse.signature;
    } else {
      return signHash(privateKey, hash(block));
    }
  };

  const generateAccountKeyPair = (accountSecretKeyBytes) => {
    return nacl.sign.keyPair.fromSecretKey(accountSecretKeyBytes);
  };

  /**
 * returns true if the work (in bytes) for the hash (in bytes) is valid.
 *
 * @memberof BananoUtil
 * @param {string} hashBytes the hash bytes to check.
 * @param {string} workBytes the work bytes to check.
 * @return {boolean} true if the work is valid for the hash.
 */
  const isWorkValid = (hashBytes, workBytes) => {
    const context = blake.blake2bInit(8);
    blake.blake2bUpdate(context, workBytes);
    blake.blake2bUpdate(context, hashBytes);
    const output = blake.blake2bFinal(context).reverse();
    const outputHex = bytesToHex(output);
    const outputBigInt = BigInt('0x' + outputHex);

    const retval = outputBigInt >= workMin;

    /* istanbul ignore if */
    if (LOG_IS_WORK_VALID) {
      console.log(`isWorkValid ${outputBigInt} >= ${workMin} ? ${retval}`);
    }

    return retval;
  };

  const incrementBytes = (bytes) => {
    let x = bytes.length - 1;
    for (x; x >= 0; x--) {
      if ( bytes[x] ^ 0xFF ) {
        bytes[x]++;
        return;
      } else {
        bytes[x] = 0;
      }
    }
  };

  /**
   * creates a new Uint8Array(8) to calculate work bytes.
   *
   * @memberof BananoUtil
   * @return {Uint8Array} the bytes in a Uint8Array.
   */
  const getZeroedWorkBytes = () => {
    return new Uint8Array(8);
  };

  const getHashCPUWorker = (hash, workBytes) => {
  /* istanbul ignore if */
    if (LOG_GET_HASH_CPU_WORKER) {
      console.log('STARTED getHashCPUWorker', hash, bytesToHex(startWorkBytes));
    }
    /* istanbul ignore if */
    if (hash === undefined) {
      throw Error('hash is a required parameter.');
    }
    /* istanbul ignore if */
    if (workBytes === undefined) {
      throw Error('workBytes is a required parameter.');
    }
    const hashBytes = hexToBytes(hash);

    // const startTime = process.hrtime.bigint();
    let isWorkValidFlag = isWorkValid(hashBytes, workBytes);

    // let isWorkValidNanos = process.hrtime.bigint() - startTime;
    // let incrementBytesNanos = BigInt(0);

    while (!isWorkValidFlag) {
      // const startTime0 = process.hrtime.bigint();
      incrementBytes(workBytes);
      // incrementBytesNanos += process.hrtime.bigint() - startTime0;

      // const startTime1 = process.hrtime.bigint();
      isWorkValidFlag = isWorkValid(hashBytes, workBytes);
      // isWorkValidNanos += process.hrtime.bigint() - startTime1;
    }
    const retval = bytesToHex(workBytes.reverse());
    /* istanbul ignore if */
    if (LOG_GET_HASH_CPU_WORKER) {
      console.log('SUCCESS getHashCPUWorker', hash, bytesToHex(startWorkBytes), retval);
    }
    return retval;
  };


  /**
 * Get the public key for a given private key.
 *
 * @memberof BananoUtil
 * @param {string} privateKey the private key.
 * @return {string} the public key.
 */
  const getPublicKey = async (privateKey) => {
    if (typeof privateKey == 'object') {
      return await privateKey.getPublicKey();
    }
    const accountKeyPair = generateAccountKeyPair(hexToBytes(privateKey));
    return bytesToHex(accountKeyPair.publicKey);
  };

  /**
 * validates a seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to validate.
 * @param {string} seedIx the index to use with the seed.
 * @return {object} {valid:[true/false] message:[if false, why]}.
 */
  const isSeedValid = (seed) => {
    const regex = new RegExp(SEED_ALPHABET_REGEX_STR);
    const isValid = regex.test(seed);
    const retval = {};
    retval.valid = isValid;
    if (isValid) {
      retval.message = '';
    } else {
      retval.message = `does not match regex '${SEED_ALPHABET_REGEX_STR}'`;
    }
    return retval;
  };

  /**
 * Get the private key for a given seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @return {string} the private key.
 */
  const getPrivateKey = (seed, seedIx) => {
  /* istanbul ignore if */
    if (seed === undefined) {
      throw Error('seed is a required parameter.');
    }
    /* istanbul ignore if */
    if (seedIx === undefined) {
      throw Error('seedIx is a required parameter.');
    }
    const isValid = isSeedValid(seed);
    if (!isValid.valid) {
      throw Error(`Invalid BANANO seed '${seed}', ${isValid.message}`);
    }
    const seedBytes = hexToBytes(seed);
    const accountBytes = generateAccountSecretKeyBytes(seedBytes, seedIx);
    return bytesToHex(accountBytes);
  };

  const send = async (bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback, accountPrefix) => {
  /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (seed === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (seedIx === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (successCallback === undefined) {
      throw Error('successCallback is a required parameter.');
    }
    /* istanbul ignore if */
    if (failureCallback === undefined) {
      throw Error('failureCallback is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED send ${seed} ${seedIx}`);
    }
    const privateKey = getPrivateKey(seed, seedIx);
    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`INTERIM send ${seed} ${seedIx} ${privateKey}`);
    }
    await sendFromPrivateKey(bananodeApi, privateKey, destAccount, amountRaw, accountPrefix)
        .then((hash) => {
          /* istanbul ignore if */
          if (LOG_SEND) {
            console.log(`SUCCESS send ${seed} ${seedIx} ${hash}`);
          }
          successCallback(hash);
        })
        .catch((error) => {
          /* istanbul ignore if */
          if (LOG_SEND) {
            console.log('FAILURE send', error);
          }
          failureCallback(error);
        });
  };

  const sendFromPrivateKey = async (bananodeApi, privateKey, destAccount, amountRaw, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    return await sendFromPrivateKeyWithRepresentative(bananodeApi, privateKey, destAccount, amountRaw, undefined, accountPrefix);
  };

  const sendFromPrivateKeyWithRepresentative = async (bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    return await sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, undefined, accountPrefix);
  };

  const sendFromPrivateKeyWithRepresentativeAndPrevious = async (bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, newPrevious, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    // newRepresentative is optional.
    // newPrevious is optional.

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED sendFromPrivateKeyWithRepresentativeAndPrevious ${destAccount} ${amountRaw}`);
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED getPublicKey ${privateKey}`);
    }
    const publicKey = await getPublicKey(privateKey);

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED getPublicAccountID ${publicKey}`);
    }
    const accountAddress = getAccount(publicKey, accountPrefix);

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED getAccountInfo ${destAccount} ${amountRaw}`);
    }

    const accountInfo = await bananodeApi.getAccountInfo(accountAddress);
    if (accountInfo == undefined) {
      throw Error(`The server's account info cannot be retrieved, please try again.`);
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`SUCCESS getAccountInfo ${accountAddress} ${JSON.stringify(accountInfo)}`);
    }

    const balanceRaw = accountInfo.balance;

    if (balanceRaw == undefined) {
      throw Error(`The server's account balance cannot be retrieved, please try again.`);
    }

    if (BigInt(balanceRaw) < BigInt(amountRaw)) {
      const balance = getAmountPartsFromRaw(balanceRaw, accountPrefix);
      const amount = getAmountPartsFromRaw(amountRaw, accountPrefix);
      const balanceMajorAmount = balance[balance.majorName];
      const amountMajorAmount = amount[amount.majorName];
      //        console.log( `balance:${JSON.stringify( balance )}` );
      throw Error(`The server's account balance of ${balanceMajorAmount} ${balance.majorName}s is too small, cannot withdraw ${amountMajorAmount} ${balance.majorName}s. In raw ${balanceRaw} < ${amountRaw}.`);
    }

    const remaining = BigInt(balanceRaw) - BigInt(amountRaw);


    const remainingDecimal = remaining.toString(10);
    let remainingPadded = remaining.toString(16);
    // Left pad with 0's
    while (remainingPadded.length < 32) {
      remainingPadded = '0' + remainingPadded;
    }

    let representative;
    if (newRepresentative !== undefined) {
      representative = newRepresentative;
    } else {
      representative = await bananodeApi.getAccountRepresentative(accountAddress);
    }


    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`INTERIM send representative ${representative}`);
    }

    let previous;
    if (newPrevious !== undefined) {
      previous = newPrevious;
    } else {
      previous = accountInfo.frontier;
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`INTERIM send previous ${previous}`);
    }

    if (previous == '') {
    /* istanbul ignore if */
      if (LOG_SEND) {
        console.log(`FAILURE previous == ''`);
      }
      return undefined;
    } else {
      // const hashBytes = hexToBytes(previous);

      const block = {};
      block.type = 'state';
      block.account = accountAddress;
      block.previous = previous;
      block.representative = representative;
      block.balance = remainingDecimal;
      const work = await bananodeApi.getGeneratedWork(previous);
      block.work = work;
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('STARTED getAccountPublicKey', destAccount);
      }
      block.link = getAccountPublicKey(destAccount);
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('SUCCESS getAccountPublicKey', destAccount);
      }
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('STARTED sign');
      }
      block.signature = await sign(privateKey, block);
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('SUCCESS sign');
      }

      /* istanbul ignore if */
      if (LOG_SEND || LOG_SEND_PROCESS) {
        console.log(`STARTED process`, block);
      }
      const processResponse = await bananodeApi.process(block, 'send');
      /* istanbul ignore if */
      if (LOG_SEND || LOG_SEND_PROCESS) {
        console.log(`SUCCESS process`, processResponse);
      }
      return processResponse;
    }
  };

  const open = async (bananodeApi, privateKey, publicKey, representative, pending, pendingValueRaw, accountPrefix) => {
    const work = await bananodeApi.getGeneratedWork(publicKey);
    const accountAddress = getAccount(publicKey, accountPrefix);
    const block = {};
    block.type = 'state';
    block.account = accountAddress;
    block.previous = '0000000000000000000000000000000000000000000000000000000000000000';
    block.representative = representative;
    block.balance = pendingValueRaw;
    block.link = pending;
    block.work = work;
    block.signature = await sign(privateKey, block);

    // console.log( 'open', block );

    try {
      const processResponse = await bananodeApi.process(block, 'open');
      /* istanbul ignore if */
      if (LOG_OPEN) {
        console.log('SUCCESS open', processResponse);
      }
      return processResponse;
    } catch (e) {
    /* istanbul ignore if */
      if (LOG_OPEN) {
        console.log('FAILURE open', JSON.stringify(e));
      }
      throw Error(e.message);
    }
  };

  const change = async (bananodeApi, privateKey, representative, accountPrefix) => {
  /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (representative === undefined) {
      throw Error('representative is a required parameter.');
    }
    const publicKey = await getPublicKey(privateKey);
    const accountAddress = getAccount(publicKey, accountPrefix);
    const accountInfo = await bananodeApi.getAccountInfo(accountAddress);
    /* istanbul ignore if */
    if (accountInfo == undefined) {
      throw Error(`The server's account info cannot be retrieved, please try again.`);
    }
    const previous = accountInfo.frontier;
    const work = await bananodeApi.getGeneratedWork(previous);
    const balanceRaw = accountInfo.balance;


    /* istanbul ignore if */
    if (balanceRaw == undefined) {
      throw Error(`The server's account balance cannot be retrieved, please try again.`);
    }

    const remaining = BigInt(balanceRaw);

    const remainingDecimal = remaining.toString(10);

    const block = {};
    block.type = 'state';
    block.account = accountAddress;
    block.previous = previous;
    block.representative = representative;
    block.balance = remainingDecimal;
    block.link = '0000000000000000000000000000000000000000000000000000000000000000';
    block.work = work;
    block.signature = await sign(privateKey, block);


    /* istanbul ignore if */
    if (LOG_CHANGE) {
      console.log('STARTED change', block);
    }
    try {
      const processResponse = await bananodeApi.process(block, 'change');
      /* istanbul ignore if */
      if (LOG_CHANGE) {
        console.log('SUCCESS change', processResponse);
      }
      return processResponse;
    } catch (e) {
    /* istanbul ignore if */
      if (LOG_RECEIVE) {
        console.log('FAILURE receive', JSON.stringify(e));
      }
      throw Error(e.message);
    }
  };

  const receive = async (bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (publicKey === undefined) {
      throw Error('publicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (representative === undefined) {
      throw Error('representative is a required parameter.');
    }
    /* istanbul ignore if */
    if (previous === undefined) {
      throw Error('previous is a required parameter.');
    }
    /* istanbul ignore if */
    if (hash === undefined) {
      throw Error('hash is a required parameter.');
    }
    /* istanbul ignore if */
    if (valueRaw === undefined) {
      throw Error('valueRaw is a required parameter.');
    }
    const work = await bananodeApi.getGeneratedWork(previous);
    const accountAddress = getAccount(publicKey, accountPrefix);

    const block = {};
    block.type = 'state';
    block.account = accountAddress;
    block.previous = previous;
    block.representative = representative;
    block.balance = valueRaw;
    block.link = hash;
    block.work = work;
    block.signature = await sign(privateKey, block);

    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log('STARTED receive', block);
    }
    try {
      const processResponse = await bananodeApi.process(block, 'receive');
      /* istanbul ignore if */
      if (LOG_RECEIVE) {
        console.log('SUCCESS receive', processResponse);
      }
      return processResponse;
    } catch (e) {
      /* istanbul ignore if */
      // console.log('FAILURE receive', e.message);
      throw Error(e.message);
    }
  };


  /**
 * @typedef {Object} AccountValidationInfo
 * @property {string} message - The message describing why the account is valid or not.
 * @property {boolean} valid - True if account is valid.
 */

  /**
  * Returns an object saying if the banano account is valid or not.

  * If the account is not valid, the message describes why it is not valid.
  *
  * @memberof BananoUtil
  * @param {string} account the account.
  * @return {AccountValidationInfo} an object saying if the account is valid, and why.
  */
  const getBananoAccountValidationInfo = (account) => {
    if (account === null) {
      return {
        message: 'Invalid BANANO Account (null)',
        valid: false,
      };
    }
    if (account === undefined) {
      return {
        message: 'Invalid BANANO Account (undefined)',
        valid: false,
      };
    }
    if (account.length == 64) {
      if (!account.startsWith('ban_1') && !account.startsWith('ban_3')) {
        return {
          message: 'Invalid BANANO Account (does not start with ban_1 or ban_3)',
          valid: false,
        };
      }
    } else {
      return {
        message: 'Invalid BANANO Account (not 64 characters)',
        valid: false,
      };
    }
    const accountCrop = account.substring(4, 64);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(accountCrop);
    if (!isValid) {
      return {
        message: `Invalid BANANO account (characters after ban_ must be one of:13456789abcdefghijkmnopqrstuwxyz)`,
        valid: false,
      };
    };

    try {
      getAccountPublicKey(account);
    } catch (error) {
      return {
        message: `Invalid BANANO account (${error.message})`,
        valid: false,
      };
    }
    return {
      message: 'valid',
      valid: true,
    };
  };

  /**
    * Returns an object saying if the nano account is valid or not.
    * If the account is not valid, the message describes why it is not valid.
    *
    * @memberof BananoUtil
    * @param {string} account the account.
    * @return {AccountValidationInfo} an object saying if the account is valid, and why.
    */
  const getNanoAccountValidationInfo = (account) => {
    if (account === null) {
      return {
        message: 'Invalid NANO Account (null)',
        valid: false,
      };
    }
    if (account === undefined) {
      return {
        message: 'Invalid NANO Account (undefined)',
        valid: false,
      };
    }
    if (account.length == 65) {
      if (!account.startsWith('nano_1') && !account.startsWith('nano_3')) {
        return {
          message: 'Invalid NANO Account (does not start with nano_1 or nano_3)',
          valid: false,
        };
      }
    } else {
      return {
        message: 'Invalid NANO Account (not 65 characters)',
        valid: false,
      };
    }
    const accountCrop = account.substring(5, 65);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(accountCrop);
    if (!isValid) {
      return {
        message: `Invalid NANO account (characters after nano_ must be one of:13456789abcdefghijkmnopqrstuwxyz)`,
        valid: false,
      };
    };

    try {
      getAccountPublicKey(account);
    } catch (error) {
      return {
        message: `Invalid NANO account (${error.message})`,
        valid: false,
      };
    }
    return {
      message: 'valid',
      valid: true,
    };
  };


  const isAccountOpen = async (bananodeApi, account) => {
    const history = await bananodeApi.getAccountHistory( account, 1 );
    const historyHistory = history.history;
    const historyHistoryLength = historyHistory.length;
    return historyHistoryLength !== 0;
  };


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.decToHex = decToHex;
    exports.incrementBytes = incrementBytes;
    exports.getNanoAccountValidationInfo = getNanoAccountValidationInfo;
    exports.getBananoAccountValidationInfo = getBananoAccountValidationInfo;
    exports.receive = receive;
    exports.open = open;
    exports.change = change;
    exports.getRawStrFromMajorAmountStr = getRawStrFromMajorAmountStr;
    exports.getRawStrFromMinorAmountStr = getRawStrFromMinorAmountStr;
    exports.getAccount = getAccount;
    exports.getPublicKey = getPublicKey;
    exports.getPrivateKey = getPrivateKey;
    exports.hash = hash;
    exports.sign = sign;
    exports.signHash = signHash;
    exports.verify = verify;
    exports.getAccountPublicKey = getAccountPublicKey;
    exports.send = send;
    exports.getHashCPUWorker = getHashCPUWorker;
    exports.getZeroedWorkBytes = getZeroedWorkBytes;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.isWorkValid = isWorkValid;
    exports.getAmountPartsFromRaw = getAmountPartsFromRaw;
    exports.sendFromPrivateKey = sendFromPrivateKey;
    exports.sendFromPrivateKeyWithRepresentative = sendFromPrivateKeyWithRepresentative;
    exports.sendFromPrivateKeyWithRepresentativeAndPrevious = sendFromPrivateKeyWithRepresentativeAndPrevious;
    exports.getAccountSuffix = getAccountSuffix;
    exports.isAccountSuffixValid = isAccountSuffixValid;
    exports.isAccountOpen = isAccountOpen;
    exports.isSeedValid = isSeedValid;
    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.bananoUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
