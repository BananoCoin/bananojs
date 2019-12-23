'use strict';

const bananoUtil = require('./app/scripts/banano-util.js');
const bananodeApi = require('./app/scripts/bananode-api.js');
const camoUtil = require('./app/scripts/camo-util.js');
const loggingUtil = require('./app/scripts/logging-util.js');
const depositUtil = require('./app/scripts/deposit-util.js');

const config = {};
config.bananodeUrl = 'https://kaliumapi.appditto.com/api';

const url = `${config.bananodeUrl}`;
bananodeApi.setUrl(url);

const commands = {};

commands['ccheckpending'] = async (seed) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const accountsPending = await bananodeApi.getAccountsPending([account], -1);
  const blocks = Object.keys(accountsPending.blocks[account]);
  console.log('camo checkpending account', account);
  console.log('camo checkpending ', blocks.length, 'pending blocks', blocks);
};

commands['cregister'] = async (seed) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const camoPublicKey = camoUtil.getCamoPublicKey(privateKey);
  const camoAccount = bananoUtil.getAccount(camoPublicKey);
  const pendingResponse = await camoUtil.receiveSeed(bananodeApi, seed);
  console.log('camo register pendingResponse', pendingResponse);
  console.log('camo register bananoAccount', account);
  console.log('camo register camoAccount', camoAccount);
  const response = await bananoUtil.sendFromPrivateKeyWithRepresentative(bananodeApi, privateKey, account, 1, camoAccount);
  console.log('camo register account response', response);
};

commands['ccheckaccount'] = async (account) => {
  const representative = await bananodeApi.getAccountRepresentative(account);
  console.log('camo checkaccount representative', representative);
};

commands['ccheckseed'] = async (seed) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  console.log('checkseed bananoAccount', account);
  const representative = await bananodeApi.getAccountRepresentative(account);
  console.log('checkseed camoAccount', representative);
};

commands['csendraw'] = async (fundingPrivateKey, seed, toAccount, amountRaw) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const toPublicKey = bananoUtil.getAccountPublicKey(toAccount);
  const hashes = await camoUtil.send(bananodeApi, fundingPrivateKey, privateKey, toPublicKey, amountRaw);
  console.log('camo sendraw response', hashes);
};

commands['creceive'] = async (seed, fromBananoAccount) => {
  const toPrivateKey = bananoUtil.getPrivateKey(seed, 0);
  const fromPublicKey = bananoUtil.getAccountPublicKey(fromBananoAccount);
  const hashes = await camoUtil.receive(bananodeApi, toPrivateKey, fromPublicKey);
  console.log('camo receive response', hashes);
};

commands['bsendraw'] = async (privateKey, destAccount, amountRaw) => {
  const response = await bananoUtil.sendFromPrivateKey(bananodeApi, privateKey, destAccount, amountRaw);
  console.log('banano sendbanano response', response);
};

commands['bcheckpending'] = async (account, maxAccountsPending) => {
  const pending = await bananodeApi.getAccountsPending([account], parseInt(maxAccountsPending));
  console.log('banano checkpending response', pending);
};

commands['bgetaccount'] = async (privateKey) => {
  const publicKey = bananoUtil.getPublicKey(privateKey);
  console.log('banano getaccount publicKey', publicKey);
  const account = bananoUtil.getAccount(publicKey);
  console.log('banano getaccount account', account);
};

commands['bgetprivatekey'] = async (seed, seedIx) => {
  const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
  console.log('banano getprivatekey privateKey', privateKey);
};

commands['breceive'] = async (privateKey, specificPendingBlockHash) => {
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  let representative = await bananodeApi.getAccountRepresentative(account);
  if (!(representative)) {
    representative = account;
  }
  const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash);
  console.log('banano receive response', response);
};

commands['baccountinfo'] = async (account) => {
  const response = await bananodeApi.getAccountInfo(account, true);
  console.log('banano accountinfo response', response);
};

const run = async () => {
  console.log('bananojs');
  if (process.argv.length < 4) {
    console.log('#usage:');
    console.log('https://github.com/BananoCoin/bananojs/blob/master/docs/camo-cli.md');
    console.log('https://github.com/BananoCoin/bananojs/blob/master/docs/banano-cli.md');
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
