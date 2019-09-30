'use strict';

const nacl = require( '../../libraries/tweetnacl/nacl.js' );

const bananoUtil = require( './banano-util.js' );

const blake = require( 'blakejs' );

const camoAmountRaw = 1;

const LOG_SWEEP_SEED_TO_INDEX = false;

const LOG_IS_HASH_IN_PENDING_OF_PRIVATE_KEY = false;

const LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO = false;

const LOG_SEND = false;

const LOG_RECEIVE = false;

/**
 * Gets the camo public key from a private key.
 *
 * a normal banano public key is used in ECDSA.
 *
 * a camo public key is used in ECDH.
 *
 * this is why the derivation is different for the two keys.
 *
 * @memberof CamoUtil
 * @param {string} privateKey the private key.
 * @return {string} the camo public key.
 */
const getCamoPublicKey = ( privateKey ) => {
  const privateKeyBytes = bananoUtil.hexToBytes( privateKey );
  const camoPublicKeyBytes = getCamoPublicKeyBytes( privateKeyBytes );
  const camoPublicKey = bananoUtil.bytesToHex( camoPublicKeyBytes );
  return camoPublicKey;
};

const getCamoPublicKeyBytes = ( privateKeyBytes ) => {
  const camoPrivateKeyBytes = nacl.camo.hashsecret( privateKeyBytes );
  const camoPublicKeyBytes = nacl.camo.scalarMult.base( camoPrivateKeyBytes );
  return camoPublicKeyBytes;
};

const getSharedSecretBytes = ( privateKeyBytes, publicKeyBytes ) => {
  const camoPrivateKeyBytes = nacl.camo.hashsecret( privateKeyBytes );
  const secretBytes = nacl.camo.scalarMult( camoPrivateKeyBytes, publicKeyBytes );

  const context = blake.blake2bInit( 32 );
  blake.blake2bUpdate( context, secretBytes );
  const hashedSecretBytes = blake.blake2bFinal( context );

  return hashedSecretBytes;
};


/**
 * Gets the shared secret from a camo public key and a private key.
 *
 * @memberof CamoUtil
 * @param {string} privateKey the private key.
 * @param {string} publicKey the public key.
 * @return {string} the shared secret.
 */
const getSharedSecret = ( privateKey, publicKey ) => {
  const privateKeyBytes = bananoUtil.hexToBytes( privateKey );
  const publicKeyBytes = bananoUtil.hexToBytes( publicKey );
  const secretBytes = getSharedSecretBytes( privateKeyBytes, publicKeyBytes );
  const secret = bananoUtil.bytesToHex( secretBytes );
  return secret;
};

const getSharedSeed = ( privateKey, publicKey, ix ) => {
  const secret = getSharedSecret( privateKey, publicKey );
  return bananoUtil.getPrivateKey( secret, ix );
};

const isUnopenedPrivateKeyInSeed = async ( bananodeApi, seed, seedIx ) => {
  const privateKey = bananoUtil.getPrivateKey( seed, seedIx );
  return await isUnopenedPrivateKey( bananodeApi, privateKey );
};

const isUnopenedPrivateKey = async ( bananodeApi, privateKey ) => {
  const publicKey = bananoUtil.getPublicKey( privateKey );
  const account = bananoUtil.getAccount( publicKey );
  // console.log( 'account', account );
  const history = await bananodeApi.getAccountHistory( account, 1 );
  // console.log( 'history', JSON.stringify( history, undefined, '  ' ) );
  const history_history = history.history;
  // console.log( 'history_history', JSON.stringify( history_history, undefined, '  ' ) );
  const history_history_length = history_history.length;
  // console.log( 'history_history_length', history_history_length );
  const history_history_length_is_0 = history_history_length == 0;

  // console.log( 'isUnopenedPrivateKey', account, history_history_length_is_0 );

  return history_history_length_is_0;
};

const getFirstUnopenedPrivateKey = async ( bananodeApi, seed ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( seed === undefined ) {
    throw Error( 'seed is a required parameter.' );
  }
  let seedIx = 0;
  let isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx );
  while ( !isUnopenedPrivateKeyFlag ) {
    seedIx++;
    isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx );
  }
  //    console.log( 'getFirstUnopenedPrivateKey', seed, seedIx );
  return bananoUtil.getPrivateKey( seed, seedIx );
};

const openAccountWithPrivateKey = async ( bananodeApi, fundingSourcePrivateKey, destPrivateKey ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( fundingSourcePrivateKey === undefined ) {
    throw Error( 'fundingSourcePrivateKey is a required parameter.' );
  }
  if ( destPrivateKey === undefined ) {
    throw Error( 'destPrivateKey is a required parameter.' );
  }
  if ( await isUnopenedPrivateKey( bananodeApi, fundingSourcePrivateKey ) ) {
    throw Error( 'fundingSourcePrivateKey is not an open account.' );
  }
  if ( ! await isUnopenedPrivateKey( bananodeApi, destPrivateKey ) ) {
    throw Error( 'destPrivateKey is not an open account.' );
  }
  const destPublicKey = bananoUtil.getPublicKey( destPrivateKey );
  const destAccount = bananoUtil.getAccount( destPublicKey );

  //    console.log( 'sendFromPrivateKey destAccount', destAccount );

  const accountsPending = await bananodeApi.getAccountsPending( [destAccount], 1 );

  const pendingBlocks = Object.keys( accountsPending.blocks[destAccount] );

  if ( pendingBlocks.length > 0 ) {
    const existingHash = pendingBlocks[0];
    console.log( `sendFromPrivateKey returned existingHash ${destAccount} ${existingHash}` );
    return existingHash;
  }

  const camoPublicKey = getCamoPublicKey( destPrivateKey );
  const camoAccount = bananoUtil.getAccount( camoPublicKey );

  //    console.log( 'destPrivateKey', destPrivateKey );
  //    console.log( 'camoAccount', camoAccount );

  const sendHash = await bananoUtil.sendFromPrivateKeyWithRepresentative( bananodeApi, fundingSourcePrivateKey, destAccount, camoAmountRaw, camoAccount );
  if ( sendHash == undefined ) {
    throw Error( 'sendFromPrivateKey failed, undefined has returned from RPC process-block.' );
  } else {
    //        console.log( `sendFromPrivateKey returned sendHash ${destAccount} ${sendHash}` );
    return sendHash;
  }
};

const sweepSeedToIndex = async ( bananodeApi, seed, destPrivateKey ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( seed === undefined ) {
    throw Error( 'seed is a required parameter.' );
  }
  if ( destPrivateKey === undefined ) {
    throw Error( 'destPrivateKey is a required parameter.' );
  }
  // TODO : send to destPrivateKey, rather than just receiveSeed.
  return receiveSeed( bananodeApi, seed );
};

const receiveSeed = async ( bananodeApi, seed ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( seed === undefined ) {
    throw Error( 'seed is a required parameter.' );
  }
  const unopenedAccounts = [];
  const privateKeyByAccount = {};
  const publicKeyByAccount = {};
  const representativeByAccount = {};

  const getAccount = ( seed, seedIx ) => {
    const privateKey = bananoUtil.getPrivateKey( seed, seedIx );
    const publicKey = bananoUtil.getPublicKey( privateKey );
    const account = bananoUtil.getAccount( publicKey );
    const camoPublicKey = getCamoPublicKey( privateKey );
    const camoAccount = bananoUtil.getAccount( camoPublicKey );

    privateKeyByAccount[account] = privateKey;
    publicKeyByAccount[account] = publicKey;
    representativeByAccount[account] = camoAccount;

    return account;
  };

  let seedIx = 0;
  let isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx );
  unopenedAccounts.push( getAccount( seed, seedIx ) );
  while ( !isUnopenedPrivateKeyFlag ) {
    if (LOG_RECEIVE) {
      console.log( 'INTERIM camo.receiveSeed', 'unopenedAccounts', 'seedIx', seedIx );
    }

    seedIx++;
    unopenedAccounts.push( getAccount( seed, seedIx ) );
    isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx );
  }
  if (LOG_RECEIVE) {
    console.log( 'accountsPending request', unopenedAccounts);
  }
  const accountsPending = await bananodeApi.getAccountsPending( unopenedAccounts, -1 );
  if (LOG_RECEIVE) {
    console.log( 'accountsPending response', accountsPending );
  }

  const accounts = Object.keys( accountsPending.blocks );

  const accountOpenAndReceiveBlocks = [];

  for ( let accountIx = 0; accountIx < accounts.length; accountIx++ ) {
    const account = accounts[accountIx];

    const history = await bananodeApi.getAccountHistory( account, 1 );
    const history_history = history.history;
    const history_history_length = history_history.length;

    if ( history_history_length == 0 ) {
      const pendingBlockHashs = Object.keys( accountsPending.blocks[account] );
      for ( let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++ ) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
        if ( pendingBlockHashIx == 0 ) {
          const privateKey = privateKeyByAccount[account];
          const publicKey = publicKeyByAccount[account];
          const representative = representativeByAccount[account];
          const pending = pendingBlockHash;
          const openBlockHash = await bananoUtil.open( bananodeApi, privateKey, publicKey, representative, pending, pendingValueRaw );
          if ( LOG_SWEEP_SEED_TO_INDEX ) {
            console.log( `accountsPending openBlockHash[${accountIx}]`, account, openBlockHash );
          }
          accountOpenAndReceiveBlocks.push( openBlockHash );
        } else {
          const privateKey = privateKeyByAccount[account];
          const publicKey = publicKeyByAccount[account];
          const representative = representativeByAccount[account];
          const frontiers = await bananodeApi.getFrontiers( account, 1 );
          const previous = frontiers[account];
          const hash = pendingBlockHash;
          const valueRaw = pendingValueRaw;
          const receiveBlockHash = await bananoUtil.receive( bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw );
          if ( LOG_SWEEP_SEED_TO_INDEX ) {
            console.log( `accountsPending receiveBlockHash[${accountIx}]`, account, receiveBlockHash );
          }
          accountOpenAndReceiveBlocks.push( receiveBlockHash );
        }
      }
    } else {
      const pendingBlockHashs = Object.keys( accountsPending.blocks[account] );
      for ( let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++ ) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
        const privateKey = privateKeyByAccount[account];
        const publicKey = publicKeyByAccount[account];
        const representative = representativeByAccount[account];
        const frontiers = await bananodeApi.getFrontiers( account, 1 );
        if ( LOG_SWEEP_SEED_TO_INDEX ) {
          console.log( `accountsPending hasHistory[${accountIx}] frontiers`, frontiers );
        }
        const accountBalanceRaw = await bananodeApi.getAccountBalanceRaw( account );

        const previous = frontiers.frontiers[account];
        const hash = pendingBlockHash;
        const valueRaw = ( BigInt( pendingValueRaw ) + BigInt( accountBalanceRaw ) ).toString();
        const receiveBlockHash = await bananoUtil.receive( bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw );
        if ( LOG_SWEEP_SEED_TO_INDEX ) {
          console.log( `accountsPending hasHistory receiveBlockHash[${accountIx}]`, account, receiveBlockHash );
        }
        accountOpenAndReceiveBlocks.push( receiveBlockHash );
      }
      if ( LOG_SWEEP_SEED_TO_INDEX ) {
        console.log( `accountsPending hasHistory[${accountIx}]`, account, history_history.length, accountsPending.blocks[account] );
      }
    }
  }

  return accountOpenAndReceiveBlocks;
};

const isHashInPendingOfPrivateKey = async ( bananodeApi, privateKey, blockHash ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( privateKey === undefined ) {
    throw Error( 'privateKey is a required parameter.' );
  }
  if ( blockHash === undefined ) {
    throw Error( 'blockHash is a required parameter.' );
  }

  const publicKey = bananoUtil.getPublicKey( privateKey );
  const account = bananoUtil.getAccount( publicKey );

  const accountsPending = await bananodeApi.getAccountsPending( [account], -1 );

  const history = await bananodeApi.getAccountHistory( account, 1 );
  const history_history = history.history;
  const history_history_length = history_history.length;

  if ( LOG_IS_HASH_IN_PENDING_OF_PRIVATE_KEY ) {
    console.log( `isHashInPendingOfPrivateKey`,
        'account', account,
        'blockHash', blockHash,
        'history_history', history_history,
        'accountsPending.blocks[account]', accountsPending.blocks[account] );
  }

  const missHashes = [];

  for ( let historyIx = 0; historyIx < history_history.length; historyIx++ ) {
    const historyBlock = history_history[historyIx];
    const historyBlockHash = historyBlock.hash;
    if ( blockHash == historyBlockHash ) {
      return true;
    } else {
      missHashes.push( historyBlockHash );
    }
  }

  const pendingBlockHashs = Object.keys( accountsPending.blocks[account] );
  for ( let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++ ) {
    const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
    if ( blockHash == pendingBlockHash ) {
      return true;
    } else {
      missHashes.push( pendingBlockHash );
    }
  }

  if ( LOG_IS_HASH_IN_PENDING_OF_PRIVATE_KEY ) {
    console.log( `isHashInPendingOfPrivateKey false`, 'account', account, 'blockHash', blockHash, 'missHashes', missHashes );
  }

  return false;
};

const getSharedSecretFromRepresentative = async ( bananodeApi, toPrivateKey, fromPublicKey ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( toPrivateKey === undefined ) {
    throw Error( 'toPrivateKey is a required parameter.' );
  }
  if ( fromPublicKey === undefined ) {
    throw Error( 'fromPublicKey is a required parameter.' );
  }
  const fromAccount = bananoUtil.getAccount( fromPublicKey );
  const fromRepresentative = await bananodeApi.getAccountRepresentative( fromAccount );
  const fromCamoPublicKey = bananoUtil.getAccountPublicKey( fromRepresentative );
  const sharedSecret = getSharedSecret( toPrivateKey, fromCamoPublicKey );
  return sharedSecret;
};

const getBalanceRaw = async ( bananodeApi, toPrivateKey, fromPublicKey ) => {
  const sharedSecret = await getSharedSecretFromRepresentative( bananodeApi, toPrivateKey, fromPublicKey );

  const seed = sharedSecret;

  const ZERO = BigInt( 0 );

  let balanceRaw = ZERO;

  let seedIx = 0;
  let accountHasBalance = true;
  while ( accountHasBalance ) {
    const privateKey = bananoUtil.getPrivateKey( seed, seedIx );
    const publicKey = bananoUtil.getPublicKey( privateKey );
    const account = bananoUtil.getAccount( publicKey );
    const accountBalanceRaw = await bananodeApi.getAccountBalanceRaw( account );

    const accountBalanceRawBigInt = BigInt( accountBalanceRaw );

    if ( accountBalanceRawBigInt == ZERO ) {
      accountHasBalance = false;
    } else {
      balanceRaw += accountBalanceRawBigInt;
      seedIx++;
    }
  }

  return balanceRaw.toString();
};

// def myfunc(x):
//    powers = []
//    i = 1
//    while i <= x:
//        if i & x:
//            powers.append(i)
//        i <<= 1
//    return powers

const splitBigIntIntoPowersOfTwo = ( value ) => {
  const ZERO = BigInt( 0 );
  const ONE = BigInt( 1 );

  if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
    console.log( 'STARTED splitBigIntIntoPowersOfTwo', value );
  }

  const powersOfTwo = [];

  let divisor = ONE;
  if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
    console.log( `INTERIM splitBigIntIntoPowersOfTwo`, value, divisor );
  }
  while ( divisor < value ) {
    if ( divisor & value ) {
      powersOfTwo.push( divisor );
    }

    divisor <<= ONE;
    if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
      console.log( `INTERIM splitBigIntIntoPowersOfTwo`, value, divisor );
    }
  }

  if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
    console.log( 'SUCCESS splitBigIntIntoPowersOfTwo', value, powersOfTwo );
  }

  return powersOfTwo;
};

const send = async ( bananodeApi, fundingPrivateKey, fromPrivateKey, toPublicKey, amountRaw ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( fundingPrivateKey === undefined ) {
    throw Error( 'fundingPrivateKey is a required parameter.' );
  }
  if ( fromPrivateKey === undefined ) {
    throw Error( 'fromPrivateKey is a required parameter.' );
  }
  if ( toPublicKey === undefined ) {
    throw Error( 'toPublicKey is a required parameter.' );
  }
  if ( amountRaw === undefined ) {
    throw Error( 'amountRaw is a required parameter.' );
  }

  if ( LOG_SEND ) {
    console.log( 'camo.send.amountRaw', amountRaw );
  }

  const bananoParts = bananoUtil.getBananoPartsFromRaw( amountRaw );

  if ( LOG_SEND ) {
    console.log( 'camo.send.bananoParts', bananoParts );
  }

  const powersOfTwoBigInts = splitBigIntIntoPowersOfTwo( BigInt( bananoParts.banano ) );

  const amounts = [];
  if ( bananoParts.banoshi !== '0' ) {
    if ( LOG_SEND ) {
      console.log( 'camo.send.bananoParts.banoshi', bananoParts.banoshi );
    }
    const banoshiRaw = bananoUtil.getRawStrFromBanoshiStr( bananoParts.banoshi );
    if ( LOG_SEND ) {
      console.log( 'camo.send.banoshiRaw', banoshiRaw );
    }
    amounts.push( banoshiRaw );
  }
  if ( bananoParts.raw !== '0' ) {
    if ( LOG_SEND ) {
      console.log( 'camo.send.raw', bananoParts.raw );
    }
    amounts.push( bananoParts.raw );
  }

  for ( let powersOfTwoBigIntIx = 0; powersOfTwoBigIntIx < powersOfTwoBigInts.length; powersOfTwoBigIntIx++ ) {
    const powersOfTwoBigInt = powersOfTwoBigInts[powersOfTwoBigIntIx];
    const powersOfTwoRaw = bananoUtil.getRawStrFromBananoStr( powersOfTwoBigInt.toString() );
    if ( LOG_SEND ) {
      console.log( `camo.send.powersOfTwoRaw[${powersOfTwoBigIntIx}]`, powersOfTwoRaw );
    }
    amounts.push( powersOfTwoRaw );
  }


  const sharedSecret = await getSharedSecretFromRepresentative( bananodeApi, fromPrivateKey, toPublicKey );
  if ( LOG_SEND ) {
    console.log( 'camo.send.sharedSecret', sharedSecret );
  }

  const destSeed = sharedSecret;

  const hashes = [];

  let previous;

  for ( let amountIx = 0; amountIx < amounts.length; amountIx++ ) {
    const amount = amounts[amountIx];
    const amountRaw = amount;
    const destSeedIx = amountIx;
    const destPrivateKey = bananoUtil.getPrivateKey( destSeed, destSeedIx );
    const destPublicKey = bananoUtil.getPublicKey( destPrivateKey );
    const destAccount = bananoUtil.getAccount( destPublicKey );
    if ( LOG_SEND ) {
      console.log( `STARTED camo.send[${destSeedIx}]`, fundingPrivateKey, destAccount, amountRaw );
    }
    const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious( bananodeApi, fundingPrivateKey, destAccount, amountRaw, undefined, previous );
    /* istanbul ignore if */
    if ( LOG_SEND ) {
      console.log( `SUCCESS camo.send[${destSeedIx}]`, 'destPrivateKey', destPrivateKey, 'hash', hash );
    }
    previous = hash;
    hashes.push( hash );
  }

  return hashes;
};

const receive = async ( bananodeApi, toPrivateKey, fromPublicKey ) => {
  if ( bananodeApi === undefined ) {
    throw Error( 'bananodeApi is a required parameter.' );
  }
  if ( toPrivateKey === undefined ) {
    throw Error( 'toPrivateKey is a required parameter.' );
  }
  if ( fromPublicKey === undefined ) {
    throw Error( 'fromPublicKey is a required parameter.' );
  }

  if (LOG_RECEIVE) {
    console.log( 'STARTED camo.receive', toPrivateKey, fromPublicKey );
  }

  const sharedSecret = await getSharedSecretFromRepresentative( bananodeApi, toPrivateKey, fromPublicKey );
  if (LOG_RECEIVE) {
    console.log( 'INTERIM camo.receive', 'sharedSecret', sharedSecret );
  }
  const seed = sharedSecret;

  const returnValue = await receiveSeed( bananodeApi, seed );
  if (LOG_RECEIVE) {
    console.log( 'SUCCESS camo.receive', returnValue );
  }
  return returnValue;
};

exports.receiveSeed = receiveSeed;
exports.receive = receive;
exports.send = send;
exports.getBalanceRaw = getBalanceRaw;
exports.isHashInPendingOfPrivateKey = isHashInPendingOfPrivateKey;
exports.sweepSeedToIndex = sweepSeedToIndex;
exports.getSharedSecret = getSharedSecret;
exports.getSharedSecretBytes = getSharedSecretBytes;
exports.getCamoPublicKey = getCamoPublicKey;
exports.getCamoPublicKeyBytes = getCamoPublicKeyBytes;
exports.getSharedSeed = getSharedSeed;
exports.getFirstUnopenedPrivateKey = getFirstUnopenedPrivateKey;
exports.openAccountWithPrivateKey = openAccountWithPrivateKey;
