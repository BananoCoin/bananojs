const assert = require('chai').assert;
const expect = require('chai').expect;

const nacl = require('../../libraries/tweetnacl/nacl.js');

const bananoUtil = require('../../app/scripts/banano-util.js');

const sleepUtil = require('../../app/scripts/sleep-util.js');

const camoUtil = require('../../app/scripts/camo-util.js');

const camoTestData = require('./camo-test-data.json');

const bananodeApi = require('../../app/scripts/bananode-api.js');

const LOG_OPEN_ACCOUNT = false;

const LOG_TEST_SHARED_SEED = false;

const LOG_WAIT_FOR_HASH = false;

const LOG_TEST_SEND_GET_BALANCE = false;

const waitForHash = async (privateKey, pendingHash) => {
  let isHashInPendingOfPrivateKeyFlag = await camoUtil.isHashInPendingOfPrivateKey(bananodeApi, privateKey, pendingHash);
  let waitCount = 0;
  while (!isHashInPendingOfPrivateKeyFlag) {
    waitCount++;
    if (LOG_WAIT_FOR_HASH) {
      console.log(`[${waitCount}] isHashInPendingOfPrivateKey returned false`);
    }
    await sleepUtil.sleep(1000);
    isHashInPendingOfPrivateKeyFlag = await camoUtil.isHashInPendingOfPrivateKey(bananodeApi, privateKey, pendingHash);
  }
};

describe('camo-account-setup', () => {
  it('find-unopened-account', async () => {
    const privateKey0 = await camoUtil.getFirstUnopenedPrivateKey(bananodeApi, camoTestData.seed0);
    expect(privateKey0).to.not.equal(camoTestData.seed0private0);
  });
  it('open-account', async () => {
    const fundingPrivateKey = bananoUtil.getPrivateKey(camoTestData.funding_seed, camoTestData.funding_seed_ix);

    const sweptCount1 = await camoUtil.receiveSeed(bananodeApi, camoTestData.seed0, fundingPrivateKey);
    if (LOG_OPEN_ACCOUNT) {
      console.log('swept pending blocks 1', sweptCount1);
    }

    const privateKey0 = await camoUtil.getFirstUnopenedPrivateKey(bananodeApi, camoTestData.seed0);
    const pendingHash0 = await camoUtil.openAccountWithPrivateKey(bananodeApi, fundingPrivateKey, privateKey0);
    if (LOG_OPEN_ACCOUNT) {
      console.log(`openAccountWithPrivateKey0 returned ${privateKey0} ${pendingHash0}`);
    }
    if (LOG_OPEN_ACCOUNT) {
      console.log(`STARTED waiting for blockchain to show hash0 ${pendingHash0}`);
    }
    await waitForHash(privateKey0, pendingHash0);
    if (LOG_OPEN_ACCOUNT) {
      console.log(`SUCCESS waiting for blockchain to show hash0 ${pendingHash0}`);
    }

    const sweptCount2 = await camoUtil.receiveSeed(bananodeApi, camoTestData.seed0, fundingPrivateKey);
    if (LOG_OPEN_ACCOUNT) {
      console.log('swept pending blocks 2', sweptCount2);
    }

    const sweptCount3 = await camoUtil.receiveSeed(bananodeApi, camoTestData.seedF, fundingPrivateKey);
    if (LOG_OPEN_ACCOUNT) {
      console.log('swept pending blocks 3', sweptCount3);
    }

    const privateKeyF = await camoUtil.getFirstUnopenedPrivateKey(bananodeApi, camoTestData.seedF);
    const pendingHashF = await camoUtil.openAccountWithPrivateKey(bananodeApi, fundingPrivateKey, privateKeyF);
    if (LOG_OPEN_ACCOUNT) {
      console.log(`openAccountWithPrivateKeyF ${privateKeyF} returned ${pendingHashF}`);
    }

    if (LOG_OPEN_ACCOUNT) {
      console.log(`STARTED waiting for blockchain to show hashF ${pendingHashF}`);
    }
    await waitForHash(privateKeyF, pendingHashF);
    if (LOG_OPEN_ACCOUNT) {
      console.log(`SUCCESS waiting for blockchain to show hashF ${pendingHashF}`);
    }

    const sweptCount4 = await camoUtil.receiveSeed(bananodeApi, camoTestData.seedF, fundingPrivateKey);
    if (LOG_OPEN_ACCOUNT) {
      console.log('swept pending blocks 4', sweptCount4);
    }
    const publicKey0 = bananoUtil.getPublicKey(privateKey0);
    const account0 = bananoUtil.getAccount(publicKey0);
    console.log('privateKey0', privateKey0, account0);

    const publicKeyF = bananoUtil.getPublicKey(privateKeyF);
    const accountF = bananoUtil.getAccount(publicKeyF);
    console.log('privateKeyF', privateKeyF, accountF);
  });
  it('test-shared-seed', async () => {
    const privateKey0 = camoTestData.shared_seed_private0;
    const publicKey0 = bananoUtil.getPublicKey(privateKey0);
    const account0 = bananoUtil.getAccount(publicKey0);
    const representative0 = await bananodeApi.getAccountRepresentative(account0);
    const camoPublicKey0 = bananoUtil.getAccountPublicKey(representative0);

    expect(publicKey0).to.equal(camoTestData.shared_seed_public0);

    if (LOG_TEST_SHARED_SEED) {
      console.log('privateKey0', privateKey0);
      console.log('publicKey0', publicKey0);
      console.log('account0', account0);
      console.log('representative0', representative0);
      console.log('camoPublicKey0', camoPublicKey0);
    }

    const privateKeyF = camoTestData.shared_seed_privateF;
    const publicKeyF = bananoUtil.getPublicKey(privateKeyF);
    const accountF = bananoUtil.getAccount(publicKeyF);
    const representativeF = await bananodeApi.getAccountRepresentative(accountF);
    const camoPublicKeyF = bananoUtil.getAccountPublicKey(representativeF);

    expect(publicKeyF).to.equal(camoTestData.shared_seed_publicF);

    if (LOG_TEST_SHARED_SEED) {
      console.log('privateKeyF', privateKeyF);
      console.log('publicKeyF', publicKeyF);
      console.log('accountF', accountF);
      console.log('representativeF', representativeF);
      console.log('camoPublicKeyF', camoPublicKeyF);
    }
    const sharedSecret0F = camoUtil.getSharedSecret(privateKey0, camoPublicKeyF);
    const sharedSecretF0 = camoUtil.getSharedSecret(privateKeyF, camoPublicKey0);

    if (LOG_TEST_SHARED_SEED) {
      console.log('sharedSecret0F', sharedSecret0F);
      console.log('sharedSecretF0', sharedSecretF0);
    }
    expect(sharedSecret0F).to.equal(sharedSecretF0);
  });
  it('test-keys-0', async () => {
    const privateKey0 = camoTestData.shared_seed_private0;
    const publicKey0 = bananoUtil.getPublicKey(privateKey0);
    const account0 = bananoUtil.getAccount(publicKey0);
    const representative0 = await bananodeApi.getAccountRepresentative(account0);
    const camoPublicKey0 = bananoUtil.getAccountPublicKey(representative0);

    expect(publicKey0).to.equal(camoTestData.shared_seed_public0);
    expect(account0).to.equal(camoTestData.shared_seed_account0);
    expect(camoPublicKey0).to.equal(camoTestData.shared_seed_camo0);
  });
  it('test-keys-F', async () => {
    const privateKeyF = camoTestData.shared_seed_privateF;
    const publicKeyF = bananoUtil.getPublicKey(privateKeyF);
    const accountF = bananoUtil.getAccount(publicKeyF);
    const representativeF = await bananodeApi.getAccountRepresentative(accountF);
    const camoPublicKeyF = bananoUtil.getAccountPublicKey(representativeF);

    expect(publicKeyF).to.equal(camoTestData.shared_seed_publicF);
    expect(accountF).to.equal(camoTestData.shared_seed_accountF);
    expect(camoPublicKeyF).to.equal(camoTestData.shared_seed_camoF);
  });
  it('test-shared-secrets', async () => {
    const sharedSecret0F = camoUtil.getSharedSecret(camoTestData.shared_seed_private0, camoTestData.shared_seed_camoF);
    expect(sharedSecret0F).to.equal(camoTestData.shared_seed0F);

    const sharedSecretF0 = camoUtil.getSharedSecret(camoTestData.shared_seed_privateF, camoTestData.shared_seed_camo0);
    expect(sharedSecretF0).to.equal(camoTestData.shared_seed0F);
  });
  it('test-send-get-balance', async () => {
    const fundingPrivateKey = bananoUtil.getPrivateKey(camoTestData.funding_seed, camoTestData.funding_seed_ix);
    const amountRaw = bananoUtil.getRawStrFromBananoStr('6');
    const balanceRawBefore = await camoUtil.getBalanceRaw(bananodeApi, camoTestData.shared_seed_privateF, camoTestData.shared_seed_public0);
    if (LOG_TEST_SEND_GET_BALANCE) {
      console.log(`before send, balance To Private Key F From Public Key 0 = ${balanceRawBefore}`);
    }
    const hashes = await camoUtil.send(bananodeApi, fundingPrivateKey, camoTestData.shared_seed_private0, camoTestData.shared_seed_publicF, amountRaw);
    if (LOG_TEST_SEND_GET_BALANCE) {
      console.log(`after send, hashes`, hashes);
      console.log('camoTestData.shared_seed0F', camoTestData.shared_seed0F);
    }
    for (let seedIx = 0; seedIx < hashes.length; seedIx++) {
      const hash = hashes[seedIx];
      const privateKey = bananoUtil.getPrivateKey(camoTestData.shared_seed0F, seedIx);
      if (LOG_TEST_SEND_GET_BALANCE) {
        console.log('STARTED waitForHash ', 'privateKey', privateKey, 'hash', hash);
      }
      await waitForHash(privateKey, hash);
      if (LOG_TEST_SEND_GET_BALANCE) {
        console.log('SUCCCESS waitForHash ', 'privateKey', privateKey, 'hash', hash);
      }
    }
    await camoUtil.receive(bananodeApi, camoTestData.shared_seed_privateF, camoTestData.shared_seed_public0);
    const balanceRawAfter = await camoUtil.getBalanceRaw(bananodeApi, camoTestData.shared_seed_privateF, camoTestData.shared_seed_public0);
    if (LOG_TEST_SEND_GET_BALANCE) {
      console.log(`after send, balance To Private Key F From Public Key 0 = ${balanceRawAfter}`);
    }

    expect(balanceRawAfter).to.not.equal(balanceRawBefore);

    if (LOG_TEST_SEND_GET_BALANCE) {
      console.log('balanceRawBefore', balanceRawBefore);
      console.log('balanceRawAfter', balanceRawAfter);
    }
  });
});
