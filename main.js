'use strict';

const index = require('./index.js');
const bananoUtil = require('./app/scripts/banano-util.js');
const bananodeApi = require('./app/scripts/bananode-api.js');
const camoUtil = require('./app/scripts/camo-util.js');
const loggingUtil = require('./app/scripts/logging-util.js');
const depositUtil = require('./app/scripts/deposit-util.js');
const crypto = require('crypto');
const BananoHwApp = require('hw-app-nano').Banano;
const transportNodeHid = require('@ledgerhq/hw-transport-node-hid');

const configs = {};
configs.banano = {};
configs.banano.walletPrefix = `44'/198'/`;
configs.banano.prefix = index.BANANO_PREFIX;
configs.banano.bananodeUrl = 'https://kaliumapi.appditto.com/api';
configs.nano = {};
configs.nano.prefix = index.NANO_PREFIX;
configs.nano.bananodeUrl = 'https://app.natrium.io/api';

const getLedgerPath = (config, accountIndex) => {
  return `${config.walletPrefix}${accountIndex}'`;
};

const getLedgerAccountData = async (config, index) => {
  // https://github.com/BananoCoin/bananovault/blob/master/src/app/services/ledger.service.ts#L128
  try {
    const paths = await transportNodeHid.default.list();
    const path = paths[0];
    const transport = await transportNodeHid.default.open(path);
    const banHwAppInst = new BananoHwApp(transport);
    const accountData = await banHwAppInst.getAddress(getLedgerPath(config, index));
    accountData.account = accountData.address;
    delete accountData.address;
    return accountData;
  } catch (error) {
    console.trace('banano getaccount error', error.message);
  }
};

const getLedgerAccountSigner = async (config, accountIx) => {
  /* istanbul ignore if */
  if (config === undefined) {
    throw Error('config is a required parameter.');
  }
  /* istanbul ignore if */
  if (accountIx === undefined) {
    throw Error('accountIx is a required parameter.');
  }
  // https://github.com/BananoCoin/bananovault/blob/master/src/app/services/ledger.service.ts#L379
  const paths = await transportNodeHid.default.list();
  const path = paths[0];
  const transport = await transportNodeHid.default.open(path);
  const banHwAppInst = new BananoHwApp(transport);
  const signer = {};
  const ledgerPath = getLedgerPath(config, accountIx);
  const accountData = await banHwAppInst.getAddress(ledgerPath);
  signer.getPublicKey = () => {
    return accountData.publicKey;
  };
  signer.getAccount = () => {
    return accountData.address;
  };
  signer.signBlock = async (blockData) => {
    // console.log('signer.signBlock', 'blockData', blockData);
    const hwBlockData = {};
    if (blockData.previous == '0000000000000000000000000000000000000000000000000000000000000000') {
      hwBlockData.representative = blockData.representative;
      hwBlockData.balance = blockData.balance;
      hwBlockData.sourceBlock = blockData.link;
    } else {
      hwBlockData.previousBlock = blockData.previous;
      hwBlockData.representative = blockData.representative;
      hwBlockData.balance = blockData.balance;
      hwBlockData.recipient = index.getBananoAccount(blockData.link);

      const cacheBlockData = {};
      const cacheBlocks = await bananodeApi.getBlocks([blockData.previous], true);
      // console.log('signer.signBlock', 'cacheBlocks', cacheBlocks);
      const cacheBlock = cacheBlocks.blocks[blockData.previous];
      // console.log('signer.signBlock', 'cacheBlock', cacheBlock);
      cacheBlockData.previousBlock = cacheBlock.previous;
      cacheBlockData.representative = cacheBlock.representative;
      cacheBlockData.balance = cacheBlock.balance;
      cacheBlockData.recipient = index.getBananoAccount(cacheBlock.link);
      // console.log('signer.signBlock', 'cacheBlockData', cacheBlockData);
      try {
        // const cacheResponse =
        await banHwAppInst.cacheBlock(ledgerPath, cacheBlockData, cacheBlock.signature);
        // console.log('signer.signBlock', 'cacheResponse', cacheResponse);
      } catch (error) {
        console.log('signer.signBlock', 'error', error.message);
        console.trace(error);
      }
    }

    // console.log('signer.signBlock', 'hwBlockData', hwBlockData);
    return await banHwAppInst.signBlock(ledgerPath, hwBlockData);
  };
  return signer;
};

const commands = {};

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
  const response = await bananodeApi.getAccountInfo(account, true);
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

commands['blgetaccount'] = async (index) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const accountData = await getLedgerAccountData(config, index);
  console.log('banano getaccount publicKey', accountData.publicKey);
  console.log('banano getaccount account', accountData.account);
};

commands['blcheckpending'] = async (index, count) => {
  if (index == undefined) {
    throw Error('index is a required parameter');
  }
  if (count == undefined) {
    throw Error('count is a required parameter');
  }
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const accountData = await getLedgerAccountData(config, index);
  const account = accountData.account;
  console.log('banano checkpending accountData', account);
  const pending = await bananodeApi.getAccountsPending([account], parseInt(count));
  console.log('banano checkpending response', pending);
};

commands['blreceive'] = async (index, specificPendingBlockHash) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const accountSigner = await getLedgerAccountSigner(config, index);
  const account = accountSigner.getAccount();
  let representative = await bananodeApi.getAccountRepresentative(account);
  if (!(representative)) {
    representative = account;
  }
  try {
    const response = await depositUtil.receive(loggingUtil, bananodeApi, account, accountSigner, representative, specificPendingBlockHash, config.prefix);
    console.log('banano receive response', response);
  } catch (error) {
    console.trace( error);
  }
};

commands['blsendraw'] = async (index, destAccount, amountRaw) => {
  const config = configs.banano;
  bananodeApi.setUrl(config.bananodeUrl);
  const accountSigner = await getLedgerAccountSigner(config, index);
  try {
    const response = await bananoUtil.sendFromPrivateKey(bananodeApi, accountSigner, destAccount, amountRaw, config.prefix);
    console.log('banano sendbanano response', response);
  } catch (error) {
    console.log('banano sendbanano error', error.message);
  }
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
