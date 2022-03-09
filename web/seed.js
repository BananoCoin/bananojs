/* eslint-disable */
const loadSeeds = () => {
  document.getElementById('seed1').value =
    '0000000000000000000000000000000000000000000000000000000000000000';
  document.getElementById('seed2').value =
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
};

/* to encrypt and decrypt seeds use the below code
CryptoJS.AES.encrypt(this.wallet.seed, this.wallet.password).toString();
const decryptedBytes = CryptoJS.AES.decrypt(this.wallet.seed, password);
const decryptedSeed = decryptedBytes.toString(CryptoJS.enc.Utf8);
*/
