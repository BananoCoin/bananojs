'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const testUtil = require('../util/test-util.js');

const seed0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey0 = '0000000000000000000000000000000000000000000000000000000000000000';
const privateKey1 = '1111111111111111111111111111111111111111111111111111111111111111';
const bananoTest = require('./banano-test.json');
const coinDatas = testUtil.getCoinDatas(bananoTest);

describe('camo', () => {
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
    it(coinData.coin + ' camoGetAccountsPending camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const count = 1;
      const invalidCamoAccount = 'camo_21111111111111111111111111111111111111111111111111111111111';
      const message = `Invalid CAMO BANANO Account prefix \'${invalidCamoAccount}\'`;
      const camoGetAccountsPending = coinData.getCamoGetAccountsPendingFn(bananojs);
      await testUtil.expectErrorMessage(message, camoGetAccountsPending,
          seed0, 0, invalidCamoAccount, count);
    });
    it(coinData.coin + ' camoGetAccountsPending camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const count = 1;
      const invalidCamoAccount = 'camo_123456789012345678901234567890123456789012345678901234567890';
      const message = `Invalid CAMO BANANO Account \'${invalidCamoAccount}\', does not match regex '^[13456789abcdefghijkmnopqrstuwxyz]+$'`;
      const camoGetAccountsPending = coinData.getCamoGetAccountsPendingFn(bananojs);
      await testUtil.expectErrorMessage(message, camoGetAccountsPending,
          seed0, 0, invalidCamoAccount, count);
    });
    it(coinData.coin + ' getCamoSharedAccountData camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const invalidCamoAccount = 'camo_123456789012345678901234567890123456789012345678901234567890';
      const message = `Invalid CAMO BANANO Account \'${invalidCamoAccount}\', does not match regex '^[13456789abcdefghijkmnopqrstuwxyz]+$'`;
      const getCamoSharedAccountData = coinData.getCamoSharedAccountDataFn(bananojs);
      await testUtil.expectErrorMessage(message, getCamoSharedAccountData,
          seed0, 0, invalidCamoAccount);
    });
    it(coinData.coin + ' getCamoSharedAccountData camo length error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const invalidCamoAccount = 'camo_1234567890123456789012345678901234567890123456789012345678901';
      const message = `Invalid CAMO BANANO Account length 66 of \'${invalidCamoAccount}\'`;
      const getCamoSharedAccountData = coinData.getCamoSharedAccountDataFn(bananojs);
      await testUtil.expectErrorMessage(message, getCamoSharedAccountData,
          seed0, 0, invalidCamoAccount);
    });
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
      if (coinData.coin == 'banano') {
        expectedResponse.push('6C22D9056710A1EC9D61D9A0BCB45CA77B1757D651D0113A845A0E53C10F4E4F');
        expectedResponse.push('C7771A83A9BABFF0E8555D2EA241DE79959C8C520519AB806ECA610B2AD2B748');
        expectedResponse.push('6B1D491C0A93CF509CC13F9964F4B2C6273FCD96469E3189873AB529EF0D7FAB');
      }
      if (coinData.coin == 'nano') {
        expectedResponse.push('2C91AAFA9FF589ED3723E5A01E11046ED335701585F232F779B437F706D2502D');
        expectedResponse.push('3A5BB8A7912F58953FF7FB5EA5FD089ED5F4715321B83CADCFA39C1FDA9E01B5');
      }
      const camoSend = coinData.getCamoSendFn(bananojs);
      const actualResponse = await camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receive account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      let expectedResponse;
      if (coinData.coin == 'banano') {
        expectedResponse = '1000000000000000000000000000000';
      }
      if (coinData.coin == 'nano') {
        expectedResponse = '10000000000000000000000000000000';
      }
      const getCamoAccountBalanceRaw = coinData.getCamoAccountBalanceRawFn(bananojs);
      const actualResponse = await getCamoAccountBalanceRaw(privateKey0, publicKey0);
      expect(expectedResponse).to.deep.equal(actualResponse);
    });
    it(coinData.coin + ' get next recieve account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const camoGetNextPrivateKeyForReceive = coinData.getCamoGetNextPrivateKeyForReceiveFn(bananojs);
      const actualResponse = await camoGetNextPrivateKeyForReceive(seed0);
      const expectedResponse = 'B73B723BF7BD042B66AD3332718BA98DE7312F95ED3D05A130C9204552A7AFFF';
      expect(expectedResponse).to.deep.equal(actualResponse);
    });
    it(coinData.coin + ' camo sendWithdrawalFromSeed 1.01 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1.01';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];

      if (coinData.coin == 'banano') {
        expectedResponse.push('6C22D9056710A1EC9D61D9A0BCB45CA77B1757D651D0113A845A0E53C10F4E4F');
        expectedResponse.push('825CE38C924FC857EE9D49282CCB7F18132549BB5F0DE56914812FB216FAFD1A');
      }
      if (coinData.coin == 'nano') {
        expectedResponse.push('BAF3A8F66639550359A8E79438302854D5A8584849EAC320467F06C526FD816D');
        expectedResponse.push('63CB98237AEF9DB7C988A4DDE7B0F349AEEE43AE3E66B3E012D41B03075DAF31');
      }
      const camoSend = coinData.getCamoSendFn(bananojs);
      const actualResponse = await camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo sendWithdrawalFromSeed 1 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];
      if (coinData.coin == 'banano') {
        expectedResponse.push('08ADFBD2D47434DCEA55C903395B2C4219C16D860A630518EBAEBD79C8E295E0');
      }
      if (coinData.coin == 'nano') {
        expectedResponse.push('60C3B3D9DD0AF49D590E8AFC448690FC9CAF8E6911641C3A40AB16DB33F8F038');
      }
      const camoSend = coinData.getCamoSendFn(bananojs);
      const actualResponse = await camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo sendWithdrawalFromSeed 5 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '5';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const expectedResponse = [];
      if (coinData.coin == 'banano') {
        expectedResponse.push('08ADFBD2D47434DCEA55C903395B2C4219C16D860A630518EBAEBD79C8E295E0');
        expectedResponse.push('EE77AC5D02D350289E62885D861664046D38EA729EFA3EDABB6D0FD6012609DE');
      }
      if (coinData.coin == 'nano') {
        expectedResponse.push('60C3B3D9DD0AF49D590E8AFC448690FC9CAF8E6911641C3A40AB16DB33F8F038');
        expectedResponse.push('65DE9FAD9E0BA9D8F5A3BFB871E353F1AA7F048570387A087993E7AFA503D88D');
      }
      const camoSend = coinData.getCamoSendFn(bananojs);
      const actualResponse = await camoSend(privateKey0, privateKey0, publicKey0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo camoSendWithdrawalFromSeed 1 valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1';
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = [];
      if (coinData.coin == 'banano') {
        expectedResponse.push('718CC9BEFC3D88A45837537E53870DEDD45BA91A6BF650A0809A48493B9E4F4C');
      }
      if (coinData.coin == 'nano') {
        expectedResponse.push('07166C6071108B28EB3099EB69C26BF469D976D9E45FD512E0FD54E01C09DD08');
      }
      const camoSendWithdrawalFromSeed = coinData.getCamoSendWithdrawalFromSeedFn(bananojs);
      const actualResponse = await camoSendWithdrawalFromSeed(seed0, 0, camoAccount0, amountBananos);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camoSendWithdrawalFromSeed camo error', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const amountBananos = '1';
      const invalidCamoAccount = 'camo_21111111111111111111111111111111111111111111111111111111111';
      const message = `Invalid CAMO BANANO Account prefix \'${invalidCamoAccount}\'`;
      const camoSendWithdrawalFromSeed = coinData.getCamoSendWithdrawalFromSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, camoSendWithdrawalFromSeed,
          seed0, 0, invalidCamoAccount, amountBananos);
    });
    it(coinData.coin + ' camo camoGetAccountsPending valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const count = 1;
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const account = `${coinData.coinPrefix}_1jzp4mwnx9htxrycg9dbsgo4psk4yd1u4z1twsngz5ei6fk3gf395w8ponjs`;
      const expectedResponse = {};
      expectedResponse.blocks = {};
      expectedResponse.blocks[account] = {
        '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 1,
        '242A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D': 2,
      };
      const camoGetAccountsPending = coinData.getCamoGetAccountsPendingFn(bananojs);
      const actualResponse = await camoGetAccountsPending(seed0, 0, camoAccount0, 0, count);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo camoGetAccountsPending no rep error', async () => {
      const bananojs = testUtil.getBananojsWithAccountRepresentativeUndefinedApi();
      const count = 1;
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = undefined;
      const camoGetAccountsPending = coinData.getCamoGetAccountsPendingFn(bananojs);
      const actualResponse = await camoGetAccountsPending(seed0, 0, camoAccount0, 0, count);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' camo getCamoSharedAccountData valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithCamoApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const account = `${coinData.coinPrefix}_1jzp4mwnx9htxrycg9dbsgo4psk4yd1u4z1twsngz5ei6fk3gf395w8ponjs`;
      const expectedResponse = {
        'sharedAccount': account,
        'sharedPrivateKey': 'EEB5604BC2C6F5E39100F380F21B8AD61FB9F4BAC96E56AB74DFABE8348891F8',
        'sharedPublicKey': '47F614F94E9DFAEE3CA71D69CBAA2B6642F2C1B17C1AE668EF8D902364173427',
        'sharedSeed': '34542F611FD696AC83EE2FD797EDE8E624C37475BABBD3E60E6834E8A502162B',
      };
      const getCamoSharedAccountData = coinData.getCamoSharedAccountDataFn(bananojs);
      const actualResponse = await getCamoSharedAccountData(seed0, 0, camoAccount0, 0);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' getCamoSharedAccountData no rep error', async () => {
      const bananojs = testUtil.getBananojsWithAccountRepresentativeUndefinedApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const expectedResponse = undefined;
      const getCamoSharedAccountData = coinData.getCamoSharedAccountDataFn(bananojs);
      const actualResponse = await getCamoSharedAccountData(seed0, 0, camoAccount0, 0);
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
      const receiveCamoDepositsForSeed = coinData.getReceiveCamoDepositsForSeedFn(bananojs);
      const actualResponse = await receiveCamoDepositsForSeed(seed0, 0, camoAccount0, 0, pendingBlockHash);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' receiveCamoBlock no rep error', async () => {
      const bananojs = testUtil.getBananojsWithAccountRepresentativeUndefinedApi();
      const publicKey0 = await bananojs.getCamoPublicKey(privateKey0);
      const camoAccount0 = await bananojs.getCamoAccount(publicKey0);
      const pendingBlockHash = '142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D';
      const expectedResponse = undefined;
      const receiveCamoDepositsForSeed = coinData.getReceiveCamoDepositsForSeedFn(bananojs);
      const actualResponse = await receiveCamoDepositsForSeed(seed0, 0, camoAccount0, 0, pendingBlockHash);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
