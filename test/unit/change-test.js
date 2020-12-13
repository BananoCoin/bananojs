'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');

const seed0 = bananoTest.seed0;
const seedIx = bananoTest.seedIx;
const coinDatas = testUtil.getCoinDatas(bananoTest);

describe('change', () => {
  coinDatas.forEach((coinData) => {
    it(coinData.coin + ' changeRepresentativeForSeed valid account matches expected', async () => {
      const bananojs = testUtil.getBananojsWithMockApi();
      const expectedResponses = {
        banano: '329E20904109CAB232624D68D568F2C2DC9675EA1C7151280E61D7E1AD397E41',
        nano: 'CAE4778886C7574F99C99FE5EA826D3E442E8260B6F75768C317B0D575F0240C',
      };
      const expectedResponse = expectedResponses[coinData.coin];
      const changeRepresentativeForSeed = coinData.getChangeRepresentativeForSeedFn(bananojs);
      const actualResponse = await changeRepresentativeForSeed(seed0, seedIx, coinData.representative1);
      expect(actualResponse).to.deep.equal(expectedResponse);
    });
    it(coinData.coin + ' changeRepresentativeForSeed error', async () => {
      const bananojs = testUtil.getBananojsWithErrorApi();
      const messages = {
        banano: 'getAccountInfo account:ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
        nano: 'getAccountInfo account:nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
      };
      const message = messages[coinData.coin];
      const changeRepresentativeForSeed = coinData.getChangeRepresentativeForSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, changeRepresentativeForSeed, seed0, seedIx, coinData.representative1);
    });
    it(coinData.coin + ' changeRepresentativeForSeed processing error', async () => {
      const bananojs = testUtil.getBananojsWithProcessErrorApi();
      const messages = {
        banano: 'process block:329E20904109CAB232624D68D568F2C2DC9675EA1C7151280E61D7E1AD397E41',
        nano: 'process block:CAE4778886C7574F99C99FE5EA826D3E442E8260B6F75768C317B0D575F0240C',
      };
      const message = messages[coinData.coin];
      const changeRepresentativeForSeed = coinData.getChangeRepresentativeForSeedFn(bananojs);
      await testUtil.expectErrorMessage(message, changeRepresentativeForSeed, seed0, seedIx, coinData.representative1);
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
