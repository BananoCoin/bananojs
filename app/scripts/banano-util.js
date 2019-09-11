const blake = require('blakejs');
const BigNumber = require('bignumber.js');

const crypto = require('crypto');

const nacl = require('../../libraries/tweetnacl/nacl.js');

const workMin = new BigNumber('0xfffffe0000000000');

const preamble = '0000000000000000000000000000000000000000000000000000000000000006';

const banoshiDivisor = BigInt('1000000000000000000000000000');

const bananoDivisor = BigInt('100000000000000000000000000000');

const LOG_SEND = false;

const LOG_SEND_PROCESS = false;

const LOG_RECEIVE = false;

const LOG_CHANGE = false;

const LOG_IS_WORK_VALID = false;

const LOG_GET_HASH_CPU_WORKER = false;

const getRawStrFromBananoStr = (bananoStr) => {
  const banano = BigInt(bananoStr);
  const bananoRaw = banano * bananoDivisor;
  return bananoRaw.toString();
};

const getRawStrFromBanoshiStr = (banoshiStr) => {
  const banoshi = BigInt(banoshiStr);
  const bananoRaw = banoshi * banoshiDivisor;
  return bananoRaw.toString();
};

const getBananoPartsFromRaw = (bananoRawStr) => {
  const bananoRaw = BigInt(bananoRawStr);
  //    console.log(`bananoRaw:    ${bananoRaw}`);
  //    console.log(`bananoDivisor:   ${bananoDivisor}`);
  const banano = bananoRaw / bananoDivisor;
  //    console.log(`banano:${banano}`);
  const bananoRawRemainder = bananoRaw - (banano * bananoDivisor);
  const banoshi = bananoRawRemainder / banoshiDivisor;
  const banoshiRawRemainder = bananoRawRemainder - (banoshi * banoshiDivisor);

  const bananoParts = {};
  bananoParts.banano = banano.toString();
  bananoParts.banoshi = banoshi.toString();
  bananoParts.raw = banoshiRawRemainder.toString();
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
  return Buffer.from(bytes).toString('hex').toUpperCase();
};

const hash = (block) => {
  if (block === undefined) {
    throw Error('block is a required parameter.');
  }
  if (block.account === undefined) {
    throw Error('block.account is a required parameter.');
  }
  if (block.previous === undefined) {
    throw Error('block.previous is a required parameter.');
  }
  if (block.representative === undefined) {
    throw Error('block.representative is a required parameter.');
  }
  if (block.balance === undefined) {
    throw Error('block.balance is a required parameter.');
  }
  if (block.link === undefined) {
    throw Error('block.link is a required parameter.');
  }
  const context = blake.blake2bInit(32, null);
  blake.blake2bUpdate(context, hexToBytes(preamble));
  blake.blake2bUpdate(context, hexToBytes(getAccountPublicKey(block.account)));
  blake.blake2bUpdate(context, hexToBytes(block.previous));
  blake.blake2bUpdate(context, hexToBytes(getAccountPublicKey(block.representative)));

  // console.log( `block.balance:${block.balance}` );
  let balanceToPad = BigNumber(block.balance).toString(16);
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

const array_crop = (array) => {
  const length = array.length - 1;
  const cropped_array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    cropped_array[i] = array[i + 1];
  }
  return cropped_array;
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

const equal_arrays = (array1, array2) => {
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
  const letter_list = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  const length = string.length;
  const string_array = string.split('');
  const uint5 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint5[i] = letter_list.indexOf(string_array[i]);
  }
  return uint5;
};

const getAccountPublicKey = (account) => {
  if (account === undefined) {
    throw Error(`Undefined BANANO Account`);
  }
  if (((!account.startsWith('ban_1')) && (!account.startsWith('ban_3'))) || (account.length !== 64)) {
    throw Error(`Invalid BANANO Account ${account}`);
  }
  const account_crop = account.substring(4, 64);
  const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(account_crop);
  if (!isValid) {
    throw Error(`Invalid BANANO account ${account}`);
  }

  const key_uint4 = array_crop(uint5ToUint4(stringToUint5(account_crop.substring(0, 52))));
  const hash_uint4 = uint5ToUint4(stringToUint5(account_crop.substring(52, 60)));
  const key_array = uint4ToUint8(key_uint4);
  const blake_hash = blake.blake2b(key_array, null, 5).reverse();

  const left = hash_uint4;
  const right = uint8ToUint4(blake_hash);
  if (!equal_arrays(left, right)) {
    const leftStr = uint5ToString(uint4ToUint5(left));
    const rightStr = uint5ToString(uint4ToUint5(right));

    throw Error(`Incorrect checksum ${leftStr} <> ${rightStr}`);
  }

  return uint4ToHex(key_uint4);
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

const getAccount = (publicKey) => {
  const keyBytes = uint4ToUint8(hexToUint4(publicKey)); // For some reason here we go from u, to hex, to 4, to 8??
  const checksum = uint5ToString(uint4ToUint5(uint8ToUint4(blake.blake2b(keyBytes, null, 5).reverse())));
  const account = uint5ToString(uint4ToUint5(hexToUint4(`0${publicKey}`)));

  return `ban_${account}${checksum}`;
};

const uint5ToString = (uint5) => {
  const letter_list = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  let string = '';
  for (let i = 0; i < uint5.length; i++) {
    string += letter_list[uint5[i]];
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

const sign = (privateKey, block) => {
  //    console.log( `sign ${JSON.stringify( block )}` );
  const hashBytes = hexToBytes(hash(block));
  //    console.log( `hashBytes[${hashBytes.length}]:${hashBytes}` );

  const privateKeyBytes = hexToBytes(privateKey);
  //    console.log( `privateKeyBytes[${privateKeyBytes.length}]:${privateKeyBytes}` );

  const signed = nacl.sign.detached(hashBytes, privateKeyBytes);
  const signature = bytesToHex(signed);
  return signature;
};

const generateAccountKeyPair = (accountSecretKeyBytes) => {
  return nacl.sign.keyPair.fromSecretKey(accountSecretKeyBytes);
};

const isWorkValid = (hashBytes, workBytes) => {
  const context = blake.blake2bInit(8);
  blake.blake2bUpdate(context, workBytes);
  blake.blake2bUpdate(context, hashBytes);
  const output = blake.blake2bFinal(context).reverse();
  const outputHex = bytesToHex(output);
  const outputBigNumber = new BigNumber('0x' + outputHex);

  const retval = outputBigNumber.isGreaterThanOrEqualTo(workMin);

  if (LOG_IS_WORK_VALID) {
    console.log(`isWorkValid ${outputBigNumber} >= ${workMin} ? ${retval}`);
  }

  return retval;
};

const incrementBytes = (bytes) => {
  let carry = true;

  for (let ix = bytes.length - 1; ix >= 0; ix--) {
    // const outputHex = '0x' + bytesToHex( bytes );
    // const outputBigNumber = new BigNumber( outputHex ).toString( 10 );
    // console.log( `ix ${ix} carry ${carry} bytes ${bytes} hex ${outputHex} ba ${outputBigNumber} ${bytes}` );
    if (carry) {
      if (bytes[ix] == 0xFF) {
        bytes[ix] = 0;
        carry = true;
      } else {
        carry = false;
        bytes[ix]++;
      }
    } else {
      if (bytes[ix] == 0xFF) {
        bytes[ix] = 0;
        carry = true;
      } else {
        return;
      }
    }
  }
};

const getHashCPUWorker = (hash, startWorkBytes) => {
  if (LOG_GET_HASH_CPU_WORKER) {
    console.log('STARTED getHashCPUWorker', hash, bytesToHex(startWorkBytes));
  }
  let workBytes;
  if (startWorkBytes === undefined) {
    workBytes = new Uint8Array(8);
  } else {
    workBytes = startWorkBytes;
  }
  const hashBytes = hexToBytes(hash);

  const startTime = process.hrtime.bigint();
  let isWorkValidFlag = isWorkValid(hashBytes, workBytes);

  let isWorkValidNanos = process.hrtime.bigint() - startTime;
  let incrementBytesNanos = BigInt(0);

  while (!isWorkValidFlag) {
    const startTime0 = process.hrtime.bigint();
    incrementBytes(workBytes);
    incrementBytesNanos += process.hrtime.bigint() - startTime0;

    const startTime1 = process.hrtime.bigint();
    isWorkValidFlag = isWorkValid(hashBytes, workBytes);
    isWorkValidNanos += process.hrtime.bigint() - startTime1;
  }
  const retval = bytesToHex(workBytes.reverse());
  if (LOG_GET_HASH_CPU_WORKER) {
    console.log('SUCCESS getHashCPUWorker', hash, bytesToHex(startWorkBytes), retval);
  }
  return retval;
};

const getPublicKey = (privateKey) => {
  const accountKeyPair = generateAccountKeyPair(hexToBytes(privateKey));
  return bytesToHex(accountKeyPair.publicKey);
};

const getPrivateKey = (seed, seedIx) => {
  if (seed === undefined) {
    throw Error('seed is a required parameter.');
  }
  if (seedIx === undefined) {
    throw Error('seedIx is a required parameter.');
  }
  const seedBytes = hexToBytes(seed);
  const accountBytes = generateAccountSecretKeyBytes(seedBytes, seedIx);
  return bytesToHex(accountBytes);
};

const send = async (bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
  if (bananodeApi === undefined) {
    throw Error('bananodeApi is a required parameter.');
  }
  if (seed === undefined) {
    throw Error('privateKey is a required parameter.');
  }
  if (seedIx === undefined) {
    throw Error('privateKey is a required parameter.');
  }
  if (destAccount === undefined) {
    throw Error('destAccount is a required parameter.');
  }
  if (amountRaw === undefined) {
    throw Error('amountRaw is a required parameter.');
  }
  if (successCallback === undefined) {
    throw Error('successCallback is a required parameter.');
  }
  if (failureCallback === undefined) {
    throw Error('failureCallback is a required parameter.');
  }
  /* istanbul ignore if */
  if (LOG_SEND) {
    console.log(`STARTED send ${seed} ${seedIx}`);
  }
  const privateKey = getPrivateKey(seed, seedIx);
  if (LOG_SEND) {
    console.log(`INTERIM send ${seed} ${seedIx} ${privateKey}`);
  }
  await sendFromPrivateKey(bananodeApi, privateKey, destAccount, amountRaw)
      .then((hash) => {
        if (LOG_SEND) {
          console.log(`SUCCESS send ${seed} ${seedIx} ${hash}`);
        }
        successCallback(hash);
      })
      .catch((error) => {
        if (LOG_SEND) {
          console.log('FAILURE send', error);
        }
        failureCallback(error);
        return;
      });
};

const sendFromPrivateKey = async (bananodeApi, privateKey, destAccount, amountRaw) => {
  return await sendFromPrivateKeyWithRepresentative(bananodeApi, privateKey, destAccount, amountRaw, undefined);
};

const sendFromPrivateKeyWithRepresentative = async (bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, newPrevious) => {
  return await sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, undefined);
};

const sendFromPrivateKeyWithRepresentativeAndPrevious = async (bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, newPrevious) => {
  if (bananodeApi === undefined) {
    throw Error('bananodeApi is a required parameter.');
  }
  if (privateKey === undefined) {
    throw Error('privateKey is a required parameter.');
  }
  if (destAccount === undefined) {
    throw Error('destAccount is a required parameter.');
  }
  if (amountRaw === undefined) {
    throw Error('amountRaw is a required parameter.');
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
  const publicKey = getPublicKey(privateKey);

  /* istanbul ignore if */
  if (LOG_SEND) {
    console.log(`STARTED getPublicAccountID ${publicKey}`);
  }
  const accountAddress = getAccount(publicKey);

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
    console.log(`SUCCESS getAccountInfo ${accountAddress} ${balanceRaw}`);
  }

  const balanceRaw = accountInfo.balance;

  if (balanceRaw == undefined) {
    throw Error(`The server's account balance cannot be retrieved, please try again.`);
  }

  if (BigInt(balanceRaw) < BigInt(amountRaw)) {
    const balance = getBananoPartsFromRaw(balanceRaw);
    const amount = getBananoPartsFromRaw(amountRaw);
    //        console.log( `balance:${JSON.stringify( balance )}` );
    throw Error(`The server's account balance of ${balance.banano} bananos is too small, cannot withdraw ${amount.banano} bananos.`);
  }

  const remaining = new BigNumber(balanceRaw).minus(amountRaw);


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
    return undefined;
  } else {
    const hashBytes = hexToBytes(previous);


    if (LOG_SEND) {
      console.log('STARTED getGeneratedWork', previous);
    }
    const work = await bananodeApi.getGeneratedWork(previous);
    if (LOG_SEND) {
      console.log('SUCCESS getGeneratedWork', previous);
    }

    if (work == undefined) {
      throw Error(`work is undefined for ${previous}`);
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`work ${work} for hash ${previous}`);
    }

    const workBytes = hexToBytes(work).reverse();
    const isWorkValidFlag = isWorkValid(hashBytes, workBytes);

    /* istanbul ignore if */
    if (!isWorkValidFlag) {
      throw (`invalid work ${work} for hash ${previous}`);
    }

    const block = {};
    block.type = 'state';
    block.account = accountAddress;
    block.previous = previous;
    block.representative = representative;
    block.balance = remainingDecimal;

    if (LOG_SEND) {
      console.log('STARTED getAccountPublicKey', destAccount);
    }
    block.link = getAccountPublicKey(destAccount);
    if (LOG_SEND) {
      console.log('SUCCESS getAccountPublicKey', destAccount);
    }
    block.work = work;
    if (LOG_SEND) {
      console.log('STARTED sign');
    }
    block.signature = sign(privateKey, block);
    if (LOG_SEND) {
      console.log('SUCCESS sign');
    }

    /* istanbul ignore if */
    if (LOG_SEND || LOG_SEND_PROCESS) {
      console.log(`STARTED process`, block);
    }
    const processResponse = await bananodeApi.process(block).catch((e) => {
      throw (e);
    });
    /* istanbul ignore if */
    if (LOG_SEND || LOG_SEND_PROCESS) {
      console.log(`SUCCESS process`, processResponse);
    }
    return processResponse;
  }
};

const open = async (bananodeApi, privateKey, publicKey, representative, pending, pendingValueRaw) => {
  const work = await bananodeApi.getGeneratedWork(publicKey);
  const accountAddress = getAccount(publicKey);
  const block = {};
  block.type = 'state';
  block.account = accountAddress;
  block.previous = '0000000000000000000000000000000000000000000000000000000000000000';
  block.representative = representative;
  block.balance = pendingValueRaw;
  block.link = pending;
  block.work = work;
  block.signature = sign(privateKey, block);

  //    console.log( 'open', block );

  const processResponse = await bananodeApi.process(block);
  return processResponse;
};

const change = async (bananodeApi, privateKey, newRepresentative) => {
  if (bananodeApi === undefined) {
    throw Error('bananodeApi is a required parameter.');
  }
  if (privateKey === undefined) {
    throw Error('privateKey is a required parameter.');
  }
  if (newRepresentative === undefined) {
    throw Error('newRepresentative is a required parameter.');
  }
  const publicKey = getPublicKey(privateKey);
  const accountAddress = getAccount(publicKey);
  const accountInfo = await bananodeApi.getAccountInfo(accountAddress);
  if (accountInfo == undefined) {
    throw Error(`The server's account info cannot be retrieved, please try again.`);
  }
  const previous = accountInfo.frontier;
  const work = await bananodeApi.getGeneratedWork(previous);
  const balanceRaw = accountInfo.balance;

  if (balanceRaw == undefined) {
    throw Error(`The server's account balance cannot be retrieved, please try again.`);
  }

  const remaining = new BigNumber(balanceRaw);

  const remainingDecimal = remaining.toString(10);

  let representative;
  if (newRepresentative !== undefined) {
    representative = newRepresentative;
  } else {
    representative = await bananodeApi.getAccountRepresentative(accountAddress);
  }

  const block = {};
  block.type = 'state';
  block.account = accountAddress;
  block.previous = previous;
  block.representative = representative;
  block.balance = remainingDecimal;
  block.link = '0000000000000000000000000000000000000000000000000000000000000000';
  block.work = work;
  block.signature = sign(privateKey, block);

  if (LOG_CHANGE) {
    console.log('STARTED change', block);
  }
  try {
    const processResponse = await bananodeApi.process(block);
    if (LOG_CHANGE) {
      console.log('SUCCESS change', processResponse);
    }
    return processResponse;
  } catch (e) {
    if (LOG_CHANGE) {
      console.log('FAILURE change', e);
    }
    throw e;
  }
};

const receive = async (bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw) => {
  if (bananodeApi === undefined) {
    throw Error('bananodeApi is a required parameter.');
  }
  if (privateKey === undefined) {
    throw Error('privateKey is a required parameter.');
  }
  if (publicKey === undefined) {
    throw Error('publicKey is a required parameter.');
  }
  if (representative === undefined) {
    throw Error('representative is a required parameter.');
  }
  if (previous === undefined) {
    throw Error('previous is a required parameter.');
  }
  if (hash === undefined) {
    throw Error('hash is a required parameter.');
  }
  if (valueRaw === undefined) {
    throw Error('valueRaw is a required parameter.');
  }
  const work = await bananodeApi.getGeneratedWork(previous);
  const accountAddress = getAccount(publicKey);
  const block = {};
  block.type = 'state';
  block.account = accountAddress;
  block.previous = previous;
  block.representative = representative;
  block.balance = valueRaw;
  block.link = hash;
  block.work = work;
  block.signature = sign(privateKey, block);

  if (LOG_RECEIVE) {
    console.log('STARTED receive', block);
  }
  try {
    const processResponse = await bananodeApi.process(block);
    if (LOG_RECEIVE) {
      console.log('SUCCESS receive', processResponse);
    }
    return processResponse;
  } catch (e) {
    if (LOG_RECEIVE) {
      console.log('FAILURE receive', e);
    }
    throw e;
  }
};

const getAccountValidationInfo = (account) => {
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
  const account_crop = account.substring(4, 64);
  const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(account_crop);
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

exports.getAccountValidationInfo = getAccountValidationInfo;
exports.receive = receive;
exports.open = open;
exports.change = change;
exports.getRawStrFromBanoshiStr = getRawStrFromBanoshiStr;
exports.getRawStrFromBananoStr = getRawStrFromBananoStr;
exports.getAccount = getAccount;
exports.getPublicKey = getPublicKey;
exports.getPrivateKey = getPrivateKey;
exports.hash = hash;
exports.sign = sign;
exports.getAccountPublicKey = getAccountPublicKey;
exports.send = send;
exports.getHashCPUWorker = getHashCPUWorker;
exports.bytesToHex = bytesToHex;
exports.hexToBytes = hexToBytes;
exports.isWorkValid = isWorkValid;
exports.getBananoPartsFromRaw = getBananoPartsFromRaw;
exports.sendFromPrivateKey = sendFromPrivateKey;
exports.sendFromPrivateKeyWithRepresentative = sendFromPrivateKeyWithRepresentative;
exports.sendFromPrivateKeyWithRepresentativeAndPrevious = sendFromPrivateKeyWithRepresentativeAndPrevious;
