'use strict';

const bananoUtil = require('./app/scripts/banano-util.js');
const bananodeApi = require('./app/scripts/bananode-api.js');
const camoUtil = require('./app/scripts/camo-util.js');

const config = require('./config.json');

if (config.bananodeUrl === undefined) {
  throw Error('bananodeUrl undefined in config.json');
}

const url = `${config.bananodeUrl}`;
bananodeApi.setUrl(url);

const commands = {};

commands['checkpending'] = async (seed) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const accountsPending = await bananodeApi.getAccountsPending([account], -1);
  const blocks = Object.keys(accountsPending.blocks[account]);
  console.log('checkpending account', account);
  console.log('checkpending ', blocks.length, 'pending blocks', blocks);
};

commands['register'] = async (seed) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  const camoPublicKey = camoUtil.getCamoPublicKey(privateKey);
  const camoAccount = bananoUtil.getAccount(camoPublicKey);
  const pendingResponse = await camoUtil.receiveSeed(bananodeApi, seed);
  console.log('register pendingResponse', pendingResponse);
  console.log('register bananoAccount', account);
  console.log('register camoAccount', camoAccount);
  const response = await bananoUtil.sendFromPrivateKeyWithRepresentative(bananodeApi, privateKey, account, 1, camoAccount);
  console.log('register account response', response);
};

commands['checkaccount'] = async (account) => {
  const representative = await bananodeApi.getAccountRepresentative(account);
  console.log('checkaccount representative', representative);
};

commands['checkseed'] = async (seed) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const publicKey = bananoUtil.getPublicKey(privateKey);
  const account = bananoUtil.getAccount(publicKey);
  console.log('checkseed bananoAccount', account);
  const representative = await bananodeApi.getAccountRepresentative(account);
  console.log('checkseed camoAccount', representative);
};

commands['sendraw'] = async (fundingPrivateKey, seed, toAccount, amountRaw) => {
  const privateKey = bananoUtil.getPrivateKey(seed, 0);
  const toPublicKey = bananoUtil.getAccountPublicKey(toAccount);
  const hashes = await camoUtil.send(bananodeApi, fundingPrivateKey, privateKey, toPublicKey, amountRaw);
  console.log('sendraw response', hashes);
};

commands['receive'] = async (seed, fromBananoAccount) => {
  const toPrivateKey = bananoUtil.getPrivateKey(seed, 0);
  const fromPublicKey = bananoUtil.getAccountPublicKey(fromBananoAccount);
  const hashes = await camoUtil.receive(bananodeApi, toPrivateKey, fromPublicKey);
  console.log('receive response', hashes);
};

const run = async () => {
  console.log('bananojs');
  if (process.argv.length < 4) {
    console.log('#usage:');
    console.log('#check for pending funds in an account:');
    console.log('npm start checkpending <camoSeed>');
    console.log('#register a camo account:');
    console.log('npm start register <camoSeed>');
    console.log('#check if a camo account is registered:');
    console.log('npm start checkaccount <bananoAcount>');
    console.log('npm start checkseed <camoSeed>');
    console.log('#send a camo transaction:');
    console.log('npm start sendraw <fundingPrivateKey> <camoSeed> <toBananoAccount> <amountRaw>');
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
