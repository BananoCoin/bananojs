
const crypto = require('crypto');
const seedBytes = new Uint8Array(32);
window.crypto.getRandomValues(seedBytes);
const seed = window.bananoUtil.bytesToHex(seedBytes);
document.getElementById('seed').innerText = seed;
const privateKey = window.bananocoinBananojs.getPrivateKey(seed, 0);
const publicKey = window.bananocoinBananojs.getPublicKey(privateKey);
const account = window.bananocoinBananojs.getAccount(publicKey);
document.getElementById('account').innerText = account;

const getHistory = async () => {
  // window.bananocoinBananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');
  window.bananocoinBananojs.setBananodeApiUrl('https://jungle.coranos.cc/api');
  const history = await window.bananocoinBananojs.getAccountHistory(account, 1);
  document.getElementById('history').innerText = JSON.stringify(history);
};

getHistory();
