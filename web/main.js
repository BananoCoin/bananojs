const url = 'https://kaliumapi.appditto.com/api';
const maxHistory = 2;
const maxPending = 2;

const getNewSeed = async (ix) => {
  const seedBytes = new Uint8Array(32);
  window.crypto.getRandomValues(seedBytes);
  const seed = window.bananocoinBananojs.bananoUtil.bytesToHex(seedBytes);
  document.getElementById('seed' + ix).value = seed;
  getAccountHistoryAndPending(ix);
  return false;
};

const getAccountHistoryAndPending = async (ix) => {
  const seed = document.getElementById('seed' + ix).value;
  const privateKey = await window.bananocoinBananojs.getPrivateKey(seed, 0);
  const publicKey = await window.bananocoinBananojs.getPublicKey(privateKey);
  const account = window.bananocoinBananojs.getBananoAccount(publicKey);
  const accountElt = document.getElementById('account' + ix);
  if (accountElt.innerText != account) {
    accountElt.innerText = account;
  }
  getCamoRepresentative(ix, seed);
  getAccountInfo(ix, account).then(async () => {
    changeRepresentativeToCamo(ix, seed).then(async () => {
      setSharedSeed();
    });
  });
  getAccountHistory(ix, account);
  getAccountsPending(ix, account);
  getBananoAccountDeposits(ix);
};

const getAccountInfo = async (ix, account) => {
  window.bananocoinBananojs.setBananodeApiUrl(url);
  const accountInfo = await window.bananocoinBananojs.getAccountInfo(account, true);
  document.getElementById('accountInfo' + ix).innerText = JSON.stringify(accountInfo);
  if (accountInfo.error) {
    setTimeout(async () => {
      getAccountInfo(ix, account);
    }, 1000);
  }
};

const getAccountHistory = async (ix, account) => {
  window.bananocoinBananojs.setBananodeApiUrl(url);
  const history = await window.bananocoinBananojs.getAccountHistory(account, maxHistory);
  document.getElementById('history' + ix).innerText = JSON.stringify(history);
  if (history.error) {
    setTimeout(async () => {
      getAccountHistory(ix, account);
    }, 1000);
  }
};

const getAccountsPending = async (ix, account) => {
  window.bananocoinBananojs.setBananodeApiUrl(url);
  const pending = await window.bananocoinBananojs.getAccountsPending([account], maxPending, true);
  document.getElementById('pending' + ix).innerText = JSON.stringify(pending);
  if (pending.error) {
    setTimeout(async () => {
      getAccountsPending(ix, account);
    }, 1000);
  }
};

const getCamoRepresentative = (ix, seed) => {
  const privateKey = window.bananocoinBananojs.getPrivateKey(seed, 0);
  const camoPublicKey = window.bananocoinBananojs.getCamoPublicKey(privateKey);
  const camoRepresentative = window.bananocoinBananojs.getCamoAccount(camoPublicKey);
  document.getElementById('camoRepresentative' + ix).innerText = camoRepresentative;
};

const getBananoAccountDeposits = async (ix) => {
  const seed = document.getElementById('seed' + ix).value;
  const privateKey = window.bananocoinBananojs.getPrivateKey(seed, 0);
  const publicKey = window.bananocoinBananojs.getPublicKey(privateKey);
  const account = window.bananocoinBananojs.getBananoAccount(publicKey);
  const response = await window.bananocoinBananojs.receiveBananoDepositsForSeed(seed, 0, account);
  document.getElementById('accountDeposits' + ix).innerText = JSON.stringify(response);
  if (response.error) {
    setTimeout(async () => {
      getBananoAccountDeposits(ix);
    }, 1000);
  }
};

const changeRepresentativeToCamo = async (ix, seed) => {
  const accountInfoStr = document.getElementById('accountInfo' + ix).innerText;
  console.log('STARTED changeRepresentativeToCamo', ix);
  const accountInfo = JSON.parse(accountInfoStr);
  const privateKey = window.bananocoinBananojs.getPrivateKey(seed, 0);
  const camoPublicKey = window.bananocoinBananojs.getCamoPublicKey(privateKey);
  const representative = window.bananocoinBananojs.getBananoAccount(camoPublicKey);
  if (accountInfo.representative) {
    if (accountInfo.representative != representative) {
      console.log(`INTERIM changeRepresentativeToCamo need to change rep from ${accountInfo.representative} to ${representative}`);
      const response = await window.bananocoinBananojs.changeBananoRepresentativeForSeed(seed, 0, representative);
      console.log('SUCCESS changeRepresentativeToCamo response', JSON.stringify(response));
      if (response.error) {
        console.log('FAILURE RETRY changeRepresentativeToCamo response', JSON.stringify(response));
        setTimeout(async () => {
          changeRepresentativeToCamo(ix, seed);
        }, 1000);
      } else {
        console.log('SUCCESS changeRepresentativeToCamo response', JSON.stringify(response));
      }
    } else {
      console.log('SKIPPED changeRepresentativeToCamo', ix, 'set correctly.');
    }
  } else {
    console.log('SKIPPED changeRepresentativeToCamo', ix, 'account not opened yet.');
  }
};

const getBanAsCamo = (banAccount) => {
  if (banAccount) {
    // console.log('STARTED getBanAsCamo', banAccount);
    const publicKey = window.bananocoinBananojs.getAccountPublicKey(banAccount);
    const camoAccount = window.bananocoinBananojs.getCamoAccount(publicKey);
    // console.log('SUCCESS getBanAsCamo', banAccount, camoAccount);
    return camoAccount;
  }
};

const setSharedSeed = async () => {
  const seed1 = document.getElementById('seed1').value;
  if (seed1.length == 0) {
    return;
  }
  const seed2 = document.getElementById('seed2').value;
  if (seed2.length == 0) {
    return;
  }
  const accountInfo1Str = document.getElementById('accountInfo1').innerText;
  if (accountInfo1Str.length == 0) {
    return;
  }
  const accountInfo2Str = document.getElementById('accountInfo2').innerText;
  if (accountInfo2Str.length == 0) {
    return;
  }
  const accountInfo1 = JSON.parse(accountInfo1Str);
  const accountInfo2 = JSON.parse(accountInfo2Str);

  const camoRepresentative1 = document.getElementById('camoRepresentative1').innerText;
  const camoRepresentative2 = document.getElementById('camoRepresentative2').innerText;

  const accountInfoRepresentativeAsCamo1 = getBanAsCamo(accountInfo1.representative);
  const accountInfoRepresentativeAsCamo2 = getBanAsCamo(accountInfo2.representative);

  if (camoRepresentative1 != accountInfoRepresentativeAsCamo1) {
    console.log('SKIPPED setSharedSeed, account1 rep not set.', camoRepresentative1, accountInfoRepresentativeAsCamo1);
    return;
  }
  if (camoRepresentative2 != accountInfoRepresentativeAsCamo2) {
    console.log('SKIPPED setSharedSeed, account2 rep not set.', camoRepresentative2, accountInfoRepresentativeAsCamo2);
    return;
  }

  const account1 = document.getElementById('account1').innerText;
  if (account1.length == 0) {
    return;
  }
  const account2 = document.getElementById('account2').innerText;
  if (account2.length == 0) {
    return;
  }
  const account1AsCamo = getBanAsCamo(account1);
  const account2AsCamo = getBanAsCamo(account2);

  const sharedData12 = await window.bananocoinBananojs.getCamoBananoSharedAccountData(seed1, 0, account2AsCamo, 0);
  const sharedData21 = await window.bananocoinBananojs.getCamoBananoSharedAccountData(seed2, 0, account1AsCamo, 0);

  if (sharedData12.sharedSeed == sharedData21.sharedSeed) {
    const seed3Elt = document.getElementById('seed3');
    if (seed3Elt.value != sharedData12.sharedSeed) {
      document.getElementById('seed3').value = sharedData12.sharedSeed;
      getAccountHistoryAndPending(3);
    }
  } else {
    console.log('SKIPPED setSharedSeed, derivations do not match', sharedData12, sharedData21);
  }
};

const onLoad = () => {
  loadSeeds();
  getAccountHistoryAndPending(1);
  getAccountHistoryAndPending(2);
};
