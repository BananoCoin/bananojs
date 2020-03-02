// const url = 'https://kaliumapi.appditto.com/api';
const url = 'https://jungle.coranos.cc/api';
const maxHistory = 2;
const maxPending = 2;

const getNewSeed = async (ix) => {
  const seedBytes = new Uint8Array(32);
  window.crypto.getRandomValues(seedBytes);
  const seed = window.bananoUtil.bytesToHex(seedBytes);
  document.getElementById('seed' + ix).value = seed;
  return false;
};

const getAccountHistoryAndPending = async (ix) => {
  const seed = document.getElementById('seed' + ix).value;
  const privateKey = window.bananocoinBananojs.getPrivateKey(seed, 0);
  const publicKey = window.bananocoinBananojs.getPublicKey(privateKey);
  const account = window.bananocoinBananojs.getAccount(publicKey);
  document.getElementById('account' + ix).innerText = account;
  getAccountInfo(ix, account);
  getAccountHistory(ix, account);
  getAccountsPending(ix, account);
};

const getAccountInfo = async (ix, account) => {
  window.bananocoinBananojs.setBananodeApiUrl(url);
  const accountInfo = await window.bananocoinBananojs.getAccountInfo(account, true);
  document.getElementById('accountInfo' + ix).innerText = JSON.stringify(accountInfo);
};

const getAccountHistory = async (ix, account) => {
  window.bananocoinBananojs.setBananodeApiUrl(url);
  const history = await window.bananocoinBananojs.getAccountHistory(account, maxHistory);
  document.getElementById('history' + ix).innerText = JSON.stringify(history);
};

const getAccountsPending = async (ix, account) => {
  window.bananocoinBananojs.setBananodeApiUrl(url);
  const pending = await window.bananocoinBananojs.getAccountsPending([account], maxPending, true);
  document.getElementById('pending' + ix).innerText = JSON.stringify(pending);
};

getAccountHistoryAndPending(1);
getAccountHistoryAndPending(2);
