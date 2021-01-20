# client side bananojs

Client side bananojs currently uses a field on the window object to store it's code.

This will be updated to use a modular include sometime soon (TM).

For now here's now to get started:

1.  include bananojs in the web page

    ```html
    <script src="../dist/bananocoin-bananojs.js"></script>
    ```

2.  generate a seed

    ```js
    const getRandomHex32 = () => {
      const array = new Uint32Array(32);
      window.crypto.getRandomValues(array);
      const hex = getByteArrayAsHexString(array);
      return hex;
    };

    window.localStorage.seed = getRandomHex32();
    ```

3.  look for account balances (will give an error in an unopened account)

    ```js
    const getAccountInfo = async (ix) => {
      const url = 'https://kaliumapi.appditto.com/api';
      const seed = window.localStorage.seed;
      const privateKey = await window.bananocoinBananojs.getPrivateKey(seed, 0);
      const publicKey = await window.bananocoinBananojs.getPublicKey(privateKey);
      const account = window.bananocoinBananojs.getBananoAccount(publicKey);
      window.bananocoinBananojs.setBananodeApiUrl(url);
      const accountInfo = await window.bananocoinBananojs.getAccountInfo(account, true);
      return accountInfo;
    }
    ```

4.  receive pending deposits

    ```js
    const receiveBananoDeposits = async () => {
      const seed = window.localStorage.seed;
      const privateKey = await window.bananocoinBananojs.getPrivateKey(seed, 0);
      const publicKey = await window.bananocoinBananojs.getPublicKey(privateKey);
      const account = window.bananocoinBananojs.getBananoAccount(publicKey);
      return await window.bananocoinBananojs.receiveBananoDepositsForSeed(seed, 0, account);
    }
    ```

5.  withdraw banano.

    ```js
    const withdrawBanano = async (withdrawAccount, withdrawAmount) => {
      const seed = window.localStorage.seed;
      return await window.bananocoinBananojs.sendBananoWithdrawalFromSeed(seed, 0, withdrawAccount, withdrawAmount);
    }
    ```
