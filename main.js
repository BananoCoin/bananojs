'use strict';

const index = require('./index.js');
const bananoUtil = require('./app/scripts/banano-util.js');
const bananodeApi = require('./app/scripts/bananode-api.js');
const camoUtil = require('./app/scripts/camo-util.js');
const loggingUtil = require('./app/scripts/logging-util.js');
const depositUtil = require('./app/scripts/deposit-util.js');
const crypto = require('crypto');
const fs = require('fs');

const configs = {};
configs.banano = {};
configs.banano.prefix = index.BANANO_PREFIX;
configs.banano.bananodeUrl = 'https://kaliumapi.appditto.com/api';
configs.nano = {};
configs.nano.prefix = index.NANO_PREFIX;
configs.nano.bananodeUrl = 'https://app.natrium.io/api';

const commands = {};

commands['cbgetaccount'] = async (seed) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  const camoPublicKey = camoUtil.getCamoPublicKey(privateKey);
  const camoAccount = bananoUtil.getAccount(camoPublicKey, config.prefix);
  console.log('camo banano getaccount public key', publicKey);
  console.log('camo banano getaccount camo public key', camoPublicKey);
  console.log('camo banano getaccount camo account', camoAccount);
};

commands['cbcheckpending'] = async (seed) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const accountsPending = await bananodeApi.getAccountsPending([account], -1);
  const blocks = Object.keys(accountsPending.blocks[account]);
  console.log('camo banano checkpending account', account);
  console.log('camo banano checkpending ', blocks.length, 'pending blocks', blocks);
};

commands['cbregister'] = async (seed) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const camoPublicKey = camoUtil.getCamoPublicKey(privateKey);
  const camoAccount = bananoUtil.getAccount(camoPublicKey);
  const pendingResponse = await camoUtil.receiveSeed(bananodeApi, seed, config.prefix);
  console.log('camo banano register pendingResponse', pendingResponse);
  console.log('camo banano register bananoAccount', account);
  console.log('camo banano register camoAccount', camoAccount);
  const response = await bananoUtil.sendFromPrivateKeyWithRepresentative(bananodeApi, privateKey, account, 1, camoAccount, config.prefix);
  console.log('camo banano register account response', response);
};

commands['cbcheckaccount'] = async (account) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const representative = await bananodeApi.getAccountRepresentative(account);
  console.log('camo banano checkaccount representative', representative);
};

commands['cbcheckseed'] = async (seed) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  console.log('checkseed bananoAccount', account);
  const representative = await bananodeApi.getAccountRepresentative(account);
  console.log('checkseed camoAccount', representative);
};

commands['cbsendraw'] = async (fundingPrivateKey, seed, toAccount, amountRaw) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const toPublicKey = bananoUtil.getAccountPublicKey(toAccount);
  const hashes = await camoUtil.send(bananodeApi, fundingPrivateKey, privateKey, toPublicKey, amountRaw);
  console.log('camo banano sendraw response', hashes);
};

commands['cbreceive'] = async (seed, fromBananoAccount) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const toPrivateKey = bananoUtil.getPrivateKey(seed, 0);
  const fromPublicKey = bananoUtil.getAccountPublicKey(fromBananoAccount);
  const hashes = await camoUtil.receive(bananodeApi, toPrivateKey, fromPublicKey);
  console.log('camo banano receive response', hashes);
};

commands['nsendraw'] = async (privateKey, destAccount, amountRaw) => {
  const config = configs.nano;
  bananodeApi.setUrl(config.bananodeUrl);
  const response = await bananoUtil.sendFromPrivateKey(bananodeApi, privateKey, destAccount, amountRaw, config.prefix);
  console.log('nano sendnano response', response);
};

commands['ncheckpending'] = async (account, maxAccountsPending) => {
  const config = configs.nano;
  bananodeApi.setUrl(config.bananodeUrl);
  const pending = await bananodeApi.getAccountsPending([account], parseInt(maxAccountsPending));
  console.log('nano checkpending response', pending);
};

commands['ngetaccount'] = async (privateKey) => {
  const config = configs.nano;
  bananodeApi.setUrl(config.bananodeUrl);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  console.log('nano getaccount publicKey', publicKey);
  const account = bananoUtil.getAccount(publicKey, config.prefix);
  console.log('nano getaccount account', account);
};

commands['ngetprivatekey'] = async (seed, seedIx) => {
  const config = configs.nano;
  bananodeApi.setUrl(config.bananodeUrl);
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  console.log('nano getprivatekey privateKey', privateKey);
};

commands['nreceive'] = async (privateKey, specificPendingBlockHash) => {
  const config = configs.nano;
  bananodeApi.setUrl(config.bananodeUrl);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey, config.prefix);
  let representative = await bananodeApi.getAccountRepresentative(account);
  if (!(representative)) {
    representative = account;
  }
  const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, config.prefix);
  console.log('nano receive response', response);
};

commands['naccountinfo'] = async (account) => {
  const config = configs.nano;
  bananodeApi.setUrl(config.bananodeUrl);
  const response = await bananodeApi.getAccountInfo(account, true);
  response.balanceParts = await bananoUtil.getAmountPartsFromRaw(response.balance, config.prefix);
  console.log('nano accountinfo response', response);
};

commands['bsendraw'] = async (privateKey, destAccount, amountRaw) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  try {
    const response = await bananoUtil.sendFromPrivateKey(bananodeApi, privateKey, destAccount, amountRaw, config.prefix);
    console.log('banano sendbanano response', response);
  } catch (error) {
    console.log('banano sendbanano error', error.message);
  }
};

commands['bsendjson'] = async (privateKey, file) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  try {
    const jsonStr = fs.readFileSync(file, 'UTF-8');
    const json = JSON.parse(jsonStr);
    const responses = [];
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, config.prefix);
    console.log('banano sendjson account', account);

    const pending = await bananodeApi.getAccountsPending([account], parseInt(1));
    console.log('banano sendjson pending', pending);
    if (pending.blocks) {
      if (pending.blocks[account]) {
        const pendingBlockhashes = [...Object.keys(pending.blocks[account])];
        const specificPendingBlockHash = pendingBlockhashes[0];
        console.log('banano sendjson aborting, found pending block ', specificPendingBlockHash);
        let representative = await bananodeApi.getAccountRepresentative(account);
        if (!(representative)) {
          representative = account;
        }
        const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, config.prefix);
        console.log('banano sendjson aborted, found pending blocks', response);
        return;
      }
    }


    for (let ix = 0; ix < json.accounts.length; ix++) {
      const elt = json.accounts[ix];
      let destAccount = elt.account;
      if (destAccount.startsWith('nano_')) {
        destAccount = 'ban_' + destAccount.substring(5);
      }
      let amountRaw;
      if (elt.amount !== undefined) {
        amountRaw = await index.getBananoDecimalAmountAsRaw(elt.amount);
      }
      if (elt.balance !== undefined) {
        amountRaw = await index.getBananoDecimalAmountAsRaw(elt.balance);
      }
      console.log('banano sendjson', destAccount, amountRaw);

      const response = await bananoUtil.sendFromPrivateKey(bananodeApi, privateKey, destAccount, amountRaw, config.prefix);
      responses.push(response);
    }
    console.log('banano sendjson responses', responses);
  } catch (error) {
    console.trace(error);
    console.log('banano sendjson error', error.message);
  }
};

commands['bcheckpending'] = async (account, maxAccountsPending) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const pending = await bananodeApi.getAccountsPending([account], parseInt(maxAccountsPending));
  console.log('banano checkpending response', pending);
};

commands['bgetaccount'] = async (privateKey) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  console.log('banano getaccount publicKey', publicKey);
  const account = bananoUtil.getAccount(publicKey, index.BANANO_PREFIX);
  console.log('banano getaccount account', account);
};

commands['bgetprivatekey'] = async (seed, seedIx) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  console.log('banano getprivatekey privateKey', privateKey);
};

commands['breceive'] = async (privateKey, specificPendingBlockHash) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const publicKey = await bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey, index.BANANO_PREFIX);
  let representative = await bananodeApi.getAccountRepresentative(account);
  if (!(representative)) {
    representative = account;
  }
  const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, config.prefix);
  console.log('banano receive response', response);
};

commands['baccountinfo'] = async (account) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  console.log('banano accountinfo account', account);
  try {
    bananoUtil.getAccountPublicKey(account);
  } catch (error) {
    console.log('banano accountinfo error', error);
    return;
  }
  const response = await bananodeApi.getAccountInfo(account, true);
  if (response.error !== undefined) {
    console.log('banano accountinfo response', response);
    return;
  }

  response.balanceParts = await bananoUtil.getAmountPartsFromRaw(response.balance, config.prefix);
  response.balanceDescription = await index.getBananoPartsDescription(response.balanceParts);
  response.balanceDecimal = await index.getBananoPartsAsDecimal(response.balanceParts);
  console.log('banano accountinfo response', response);
};

commands['bamountraw'] = async (amount) => {
  const response = index.getBananoDecimalAmountAsRaw(amount);
  console.log('bamountraw response', response);
};

commands['getseed'] = async () => {
  const response = crypto.randomBytes(32).toString('hex').toUpperCase();
  console.log('getseed response', response);
};


const run = async () => {
  console.log('bananojs');
  if (process.argv.length < 3) {
    console.log('#usage:');
    console.log('https://github.com/BananoCoin/bananojs/blob/master/docs/camo-cli.md');
    console.log('https://github.com/BananoCoin/bananojs/blob/master/docs/banano-cli.md');
    console.log('https://github.com/BananoCoin/bananojs/blob/master/docs/nano-cli.md');
  } else {
    const command = process.argv[2];
    const arg0 = process.argv[3];
    const arg1 = process.argv[4];
    const arg2 = process.argv[5];
    const arg3 = process.argv[6];

    const fn = commands[command];
    if (fn == undefined) {
      console.log('unknown command', command);
    } else {
      await fn(arg0, arg1, arg2, arg3);
    }
  }
};

run();
