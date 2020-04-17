'use strict';

// libraries
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

const seed0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';
const bananoTest = require('./banano-test.json');
const coinDatas = testUtil.getCoinDatas(bananoTest);

describe.only('camo', () => {
  it('getCamoPublicKey account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const expectedResponse = '80989F0ED4154E886AD926392DB1F9B524AB250A1BEEBA6C999A2F06C36F7E00';
    const actualResponse = await bananojs.getCamoPublicKey(privateKey0);
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  it('getSharedSecret account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const publicKey1 = await bananojs.getCamoPublicKey(privateKey1);
    const sharedSecret01 = await bananojs.getSharedSecret(privateKey0, publicKey1);
    const sharedSecret10 = await bananojs.getSharedSecret(privateKey1, publicKey0);
    expect(sharedSecret01).to.deep.equal(sharedSecret10);
  });
  it('camo account matches expected', async () => {
    const bananojs = testUtil.getBananojsWithCamoApi();
    const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
    const actualResponse = await bananojs.getCamoAccount(publicKey0);
    const expectedResponse = 'camo_316rmw9fa7cgj3ofkbjs7przmfb6oekin8zgqbpbm8jh1u3pyzi1ht7bh7e9';
    expect(expectedResponse).to.deep.equal(actualResponse);
  });
  coinDatas.forEach((coinData) => {
    it(coinData.coin + ' receive account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];
      expectedResponse.push('DB0C46B3A823D545E189A8C40C17CB65A0A7F40671C41BB8E6567C1965DB730D');
      expectedResponse.push('B9A4133E415DE4E136A1BFE20E2ADEA8B23D4FAFF7349812DB92834DDAFC2642');
      const camoReceive = coinData.getCamoReceiveFn(bananojs);
      const actualResponse = await camoReceive(privateKey0, publicKey0);
      expect(expectedResponse).to.deep.equal(actualResponse);
    });
    it(coinData.coin + ' receive account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const publicKey1 = await bananojs.getCamoPublicKey(privateKey1);
      const expectedResponse = [];
      expectedResponse.push('C239042917BBE0725E31029911F99A66525409A04B2EFB80B29A6A38755BA3A8');
      expectedResponse.push('98A4831A04AE621D5AAAA004858DDB44EF98C4F520CF702BEAC942C5EB54530F');
      expectedResponse.push('08EFF77F9D9D2EA1F3DAAC1844B353E9E760ACB1B7F48D07F0C0DD8BC8108C7C');
      expectedResponse.push('B11C530C40985A30383D44A7B08A86CCEBBFE6EF6079805E28809BECF8C184EE');
      const camoReceive = coinData.getCamoReceiveFn(bananojs);
      const actualResponse = await camoReceive(privateKey1, publicKey1);
      expect(expectedResponse).to.deep.equal(actualResponse);
    });
    it(coinData.coin + ' camo sendWithdrawalFromSeed 1.011 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1.011';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];
      expectedResponse.push('6C22D9056710A1EC9D61D9A0BCB45CA77B1757D651D0113A845A0E53C10F4E4F');
      expectedResponse.push('C7771A83A9BABFF0E8555D2EA241DE79959C8C520519AB806ECA610B2AD2B748');
      expectedResponse.push('6B1D491C0A93CF509CC13F9964F4B2C6273FCD96469E3189873AB529EF0D7FAB');
      const camoSend = coinData.getCamoSendFn(bananojs);
      const actualResponse = await camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receive account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = '1000000000000000000000000000000';
      const actualResponse = await bananojs.getCamoAccountBalanceRaw(privateKey0, publicKey0);
      expect(expectedResponse).to.deep.equal(actualResponse);
    });
    it(coinData.coin + ' get next recieve account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const actualResponse = await bananojs.camoGetNextPrivateKeyForReceive(seed0);
      const expectedResponse = 'B73B723BF7BD042B66AD3332718BA98DE7312F95ED3D05A130C9204552A7AFFF';
      expect(expectedResponse).to.deep.equal(actualResponse);
    });
    it(coinData.coin + ' camo sendWithdrawalFromSeed 1.01 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1.01';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];
      expectedResponse.push('6C22D9056710A1EC9D61D9A0BCB45CA77B1757D651D0113A845A0E53C10F4E4F');
      expectedResponse.push('825CE38C924FC857EE9D49282CCB7F18132549BB5F0DE56914812FB216FAFD1A');
      const actualResponse = await bananojs.camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo sendWithdrawalFromSeed 1 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];
      expectedResponse.push('08ADFBD2D47434DCEA55C903395B2C4219C16D860A630518EBAEBD79C8E295E0');
      const actualResponse = await bananojs.camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo sendWithdrawalFromSeed 5 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '5';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];
      expectedResponse.push('08ADFBD2D47434DCEA55C903395B2C4219C16D860A630518EBAEBD79C8E295E0');
      expectedResponse.push('EE77AC5D02D350289E62885D861664046D38EA729EFA3EDABB6D0FD6012609DE');
      const actualResponse = await bananojs.camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo camoSendWithdrawalFromSeed 1 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = [];
      expectedResponse.push('718CC9BEFC3D88A45837537E53870DEDD45BA91A6BF650A0809A48493B9E4F4C');
      const actualResponse = await bananojs.camoSendWithdrawalFromSeed(seed0, 0, camoAccount0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camoSendWithdrawalFromSeed camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1';
      const invalidCamoAccount = 'camo_21111111111111111111111111111111111111111111111111111111111';
      const message = `Invalid CAMO BANANO Account prefix \'${invalidCamoAccount}\'`;
      await testUtil.expectErrorMessage(message, bananojs.camoSendWithdrawalFromSeed,
          seed0, 0, invalidCamoAccount, amountBananos);
    });
    it(coinData.coin + ' camo camoGetAccountsPending valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const count = 1;
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = {
        'blocks': {
          'ban_1jzp4mwnx9htxrycg9dbsgo4psk4yd1u4z1twsngz5ei6fk3gf395w8ponjs': {
            '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 1,
            '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 2,
          },
        },
      };
      const actualResponse = await bananojs.camoGetAccountsPending(seed0, 0, camoAccount0, 0, count);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo camoGetAccountsPending no rep error', async () => {
      const bananojs = testUtil.getBananojsWithAccountRepresentativeUndefinedApi();
      const count = 1;
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = undefined;
      const actualResponse = await bananojs.camoGetAccountsPending(seed0, 0, camoAccount0, 0, count);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camoGetAccountsPending camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const count = 1;
      const invalidCamoAccount = 'camo_21111111111111111111111111111111111111111111111111111111111';
      const message = `Invalid CAMO BANANO Account prefix \'${invalidCamoAccount}\'`;
      await testUtil.expectErrorMessage(message, bananojs.camoGetAccountsPending,
          seed0, 0, invalidCamoAccount, count);
    });
    it(coinData.coin + ' camoGetAccountsPending camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const count = 1;
      const invalidCamoAccount = 'camo_123456789012345678901234567890123456789012345678901234567890';
      const message = `Invalid CAMO BANANO Account \'${invalidCamoAccount}\', does not match regex '^[13456789abcdefghijkmnopqrstuwxyz]+$'`;
      await testUtil.expectErrorMessage(message, bananojs.camoGetAccountsPending,
          seed0, 0, invalidCamoAccount, count);
    });
    it(coinData.coin + ' camo getCamoSharedAccountData valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = {
        'sharedAccount': 'ban_1jzp4mwnx9htxrycg9dbsgo4psk4yd1u4z1twsngz5ei6fk3gf395w8ponjs',
        'sharedPrivateKey': 'EEB5604BC2C6F5E39100F380F21B8AD61FB9F4BAC96E56AB74DFABE8348891F8',
        'sharedPublicKey': '47F614F94E9DFAEE3CA71D69CBAA2B6642F2C1B17C1AE668EF8D902364173427',
        'sharedSeed': '34542F611FD696AC83EE2FD797EDE8E624C37475BABBD3E60E6834E8A502162B',
      };
      const actualResponse = await bananojs.getCamoSharedAccountData(seed0, 0, camoAccount0, 0);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' getCamoSharedAccountData camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const invalidCamoAccount = 'camo_123456789012345678901234567890123456789012345678901234567890';
      const message = `Invalid CAMO BANANO Account \'${invalidCamoAccount}\', does not match regex '^[13456789abcdefghijkmnopqrstuwxyz]+$'`;
      await testUtil.expectErrorMessage(message, bananojs.getCamoSharedAccountData,
          seed0, 0, invalidCamoAccount);
    });
    it(coinData.coin + ' getCamoSharedAccountData camo length error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const invalidCamoAccount = 'camo_1234567890123456789012345678901234567890123456789012345678901';
      const message = `Invalid CAMO BANANO Account length 66 of \'${invalidCamoAccount}\'`;
      await testUtil.expectErrorMessage(message, bananojs.getCamoSharedAccountData,
          seed0, 0, invalidCamoAccount);
    });
    it(coinData.coin + ' getCamoSharedAccountData no rep error', async () => {
      const bananojs = testUtil.getBananojsWithAccountRepresentativeUndefinedApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = undefined;
      const actualResponse = await bananojs.getCamoSharedAccountData(seed0, 0, camoAccount0, 0);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo receiveCamoBlock valid response', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const pendingBlockHash = '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D';
      const expectedResponse = {
        'pendingCount': 2,
        'pendingMessage': 'pending 2 blocks, of max 10.',
        'pendingBlocks': [
          '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
          '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D',
        ],
        'receiveCount': 1,
        'receiveMessage': 'received 1 blocks.',
        'receiveBlocks': [
          '4F7E6D8601FBB46724961EC20ADAC95C79828A5BFB5EF61E31688F4488D75516',
        ],
      };
      const actualResponse = await bananojs.receiveCamoDepositsForSeed(seed0, 0, camoAccount0, 0, pendingBlockHash);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receiveCamoBlock no rep error', async () => {
      const bananojs = testUtil.getBananojsWithAccountRepresentativeUndefinedApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const pendingBlockHash = '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D';
      const expectedResponse = undefined;
      const actualResponse = await bananojs.receiveCamoDepositsForSeed(seed0, 0, camoAccount0, 0, pendingBlockHash);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
