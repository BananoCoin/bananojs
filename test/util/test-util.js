'use strict';

// libraries
const chai = require('chai');

// modules
const bananojs = require('../../index.js');
const assert = chai.assert;
const expect = chai.expect;

const getTimeNanos = () => {
  return BigInt(process.hrtime.bigint());
};


const getCoinDatas = (bananoTest) => {
  if (bananoTest == undefined) {
    throw Error( 'bananoTest is a required parameter.' );
  }
  return [
    {
      coin: 'banano',
      coinPrefix: 'ban',
      getChangeRepresentativeForSeedFn: (bananojs) => {
        return bananojs.changeBananoRepresentativeForSeed;
      },
      getSendWithdrawalFromSeedFn: (bananojs) => {
        return bananojs.sendBananoWithdrawalFromSeed;
      },
      getSendAmountToAccountFn: (bananojs) => {
        return bananojs.sendAmountToBananoAccount;
      },
      getSendAmountToAccountWithRepresentativeAndPreviousFn: (bananojs) => {
        return bananojs.sendAmountToBananoAccountWithRepresentativeAndPrevious;
      },
      getAccountFromSeedFn: (bananojs) => {
        return bananojs.getBananoAccountFromSeed;
      },
      getReceiveDepositsForSeedFn: (bananojs) => {
        return bananojs.receiveBananoDepositsForSeed;
      },
      getOpenAccountFromSeedFn: (bananojs) => {
        return bananojs.openBananoAccountFromSeed;
      },
      getReceiveCamoDepositsForSeedFn: (bananojs) => {
        return bananojs.receiveCamoBananoDepositsForSeed;
      },
      getCamoReceiveFn: (bananojs) => {
        return bananojs.camoBananoReceive;
      },
      getCamoSendFn: (bananojs) => {
        return bananojs.camoBananoSend;
      },
      getCamoAccountBalanceRawFn: (bananojs) => {
        return bananojs.getCamoBananoAccountBalanceRaw;
      },
      getCamoGetNextPrivateKeyForReceiveFn: (bananojs) => {
        return bananojs.getCamoBananoNextPrivateKeyForReceive;
      },
      getCamoSendWithdrawalFromSeedFn: (bananojs) => {
        return bananojs.camoBananoSendWithdrawalFromSeed;
      },
      getCamoSharedAccountDataFn: (bananojs) => {
        return bananojs.getCamoBananoSharedAccountData;
      },
      getCamoGetAccountsPendingFn: (bananojs) => {
        return bananojs.camoBananoGetAccountsPending;
      },
      representative1: bananoTest.bananoRepresentative1,
      toAccount: bananoTest.bananoAccount,
      bad: {
        seed: 'F975E272ECAF243CB30D3DAB4473F14A482A255A46AE140B1F96F5A1F32F3D51',
        account: 'ban_1bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq',
      },
    },
    {
      coin: 'nano',
      coinPrefix: 'nano',
      getChangeRepresentativeForSeedFn: (bananojs) => {
        return bananojs.changeNanoRepresentativeForSeed;
      },
      getSendWithdrawalFromSeedFn: (bananojs) => {
        return bananojs.sendNanoWithdrawalFromSeed;
      },
      getSendAmountToAccountFn: (bananojs) => {
        return bananojs.sendAmountToNanoAccount;
      },
      getSendAmountToAccountWithRepresentativeAndPreviousFn: (bananojs) => {
        return bananojs.sendAmountToNanoAccountWithRepresentativeAndPrevious;
      },
      getAccountFromSeedFn: (bananojs) => {
        return bananojs.getNanoAccountFromSeed;
      },
      getReceiveDepositsForSeedFn: (bananojs) => {
        return bananojs.receiveNanoDepositsForSeed;
      },
      getOpenAccountFromSeedFn: (bananojs) => {
        return bananojs.openNanoAccountFromSeed;
      },
      getReceiveCamoDepositsForSeedFn: (bananojs) => {
        return bananojs.receiveCamoNanoDepositsForSeed;
      },
      getCamoReceiveFn: (bananojs) => {
        return bananojs.camoNanoReceive;
      },
      getCamoSendFn: (bananojs) => {
        return bananojs.camoNanoSend;
      },
      getCamoAccountBalanceRawFn: (bananojs) => {
        return bananojs.getCamoNanoAccountBalanceRaw;
      },
      getCamoGetNextPrivateKeyForReceiveFn: (bananojs) => {
        return bananojs.getCamoNanoNextPrivateKeyForReceive;
      },
      getCamoSendWithdrawalFromSeedFn: (bananojs) => {
        return bananojs.camoNanoSendWithdrawalFromSeed;
      },
      getCamoSharedAccountDataFn: (bananojs) => {
        return bananojs.getCamoNanoSharedAccountData;
      },
      getCamoGetAccountsPendingFn: (bananojs) => {
        return bananojs.camoNanoGetAccountsPending;
      },
      representative1: bananoTest.nanoRepresentative1,
      toAccount: bananoTest.nanoAccount,
      bad: {
        seed: 'F975E272ECAF243CB30D3DAB4473F14A482A255A46AE140B1F96F5A1F32F3D51',
        account: 'nano_1bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq',
      },
    },
  ];
};

const getBananojsWithMockApi = () => {
  const bananodeApi = require('./mock-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithRealApi = () => {
  const bananodeApi = require('./mock-bananode-api.js');
  bananojs.setBananodeApi(bananojs.realBananodeApi);
  return bananojs;
};

const getBananojsWithErrorApi = () => {
  const bananodeApi = require('./everything-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithProcessErrorApi = () => {
  const bananodeApi = require('./process-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithProcessForkApi = () => {
  const bananodeApi = require('./process-fork-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithPendingErrorApi = () => {
  const bananodeApi = require('./pending-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithAccountRepresentativeUndefinedApi = () => {
  const bananodeApi = require('./representative-undefined-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithAccountInfoBalanceErrorApi = () => {
  const bananodeApi = require('./account-info-balance-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithAccountInfoErrorApi = () => {
  const bananodeApi = require('./account-info-error-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const getBananojsWithCamoApi = () => {
  const bananodeApi = require('./camo-bananode-api.js');
  bananojs.setBananodeApi(bananodeApi);
  return bananojs;
};

const expectErrorMessage = async (errorMessage, fn, arg1, arg2, arg3, arg4, arg5, arg6) => {
  try {
    await fn(arg1, arg2, arg3, arg4, arg5, arg6);
  } catch (err) {
    assert.isDefined(err);
    // console.trace('expectErrorMessage', errorMessage, fn, err.message);
    expect(errorMessage).to.deep.equal(err.message);
    if (err.message != errorMessage) {
      // console.trace('expectErrorMessage', errorMessage, fn, err);
      assert.fail(`expected:'${errorMessage}'<>actual:'${err.message}'`);
    }
    return;
  }
  assert.fail(`no error was thrown, expected err.message='${errorMessage}'`);
};

const deactivate = () => {
  bananojs.setBananodeApi(undefined);
};

exports.getTimeNanos = getTimeNanos;
exports.getBananojsWithRealApi = getBananojsWithRealApi;
exports.getBananojsWithMockApi = getBananojsWithMockApi;
exports.getBananojsWithErrorApi = getBananojsWithErrorApi;
exports.getBananojsWithProcessErrorApi = getBananojsWithProcessErrorApi;
exports.getBananojsWithAccountInfoBalanceErrorApi = getBananojsWithAccountInfoBalanceErrorApi;
exports.getBananojsWithAccountInfoErrorApi = getBananojsWithAccountInfoErrorApi;
exports.getBananojsWithCamoApi = getBananojsWithCamoApi;
exports.getBananojsWithPendingErrorApi = getBananojsWithPendingErrorApi;
exports.getBananojsWithAccountRepresentativeUndefinedApi = getBananojsWithAccountRepresentativeUndefinedApi;
exports.getBananojsWithProcessForkApi = getBananojsWithProcessForkApi;
exports.expectErrorMessage = expectErrorMessage;
exports.getCoinDatas = getCoinDatas;
exports.deactivate = deactivate;
