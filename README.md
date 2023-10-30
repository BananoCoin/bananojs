# bananojs

JavaScript utilities for the banano cryptocurrency.

make sure to use `npm i @bananocoin/bananojs@latest` to get the latest version.

now includes Ledger Nano S/X Support in a different project:
    https://github.com/BananoCoin/bananojs-hw

# simple banano functions

```js
const run = async () => {
  const bananojs = require('@bananocoin/bananojs');
  bananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');

  //generate random seed and wallet, then log first address of wallet
  const crypto = require('crypto');
  const seed = crypto.randomBytes(32).toString('hex'); //seeds are 32 bytes
  const privateKey = bananojs.getPrivateKey(seed, 0);
  const publicKey = await bananojs.getPublicKey(privateKey);
  const account = bananojs.getBananoAccount(publicKey); //the Banano address
  console.log(account);

  //get account info of addresses: https://docs.nano.org/commands/rpc-protocol/#account_info
  console.log(await bananojs.getAccountInfo(account)); //should log "{ error: 'Account not found' }" since account is unopened (hasn't received any transactions yet)
  console.log(await bananojs.getAccountInfo("ban_1rp1aceaawpub5zyztzs4tn7gcugm5bc3o6oga16bb18bquqm1bjnoomynze")); //works

  //get account history of address: https://docs.nano.org/commands/rpc-protocol/#account_history
  console.log(await bananojs.getAccountHistory("ban_1rp1aceaawpub5zyztzs4tn7gcugm5bc3o6oga16bb18bquqm1bjnoomynze", 3)); //(last 3 transactions)
};
run();
```

# examples of most functions as part of the cli

  <https://github.com/BananoCoin/bananojs/blob/master/main.js>

# simple browser integration

  https://bananocoin.github.io/bananojs/web/

# description on how to do browser integration

  <https://github.com/BananoCoin/bananojs/blob/master/docs/banano-client-side.md>

# complete documentation of all functions that are documented.

  <https://github.com/BananoCoin/bananojs/blob/master/docs/documentation.md>

# notes on using CLI:
  please remember to install and test before running the CLI.
```
  npm i;

  #test on osx/linux
  npm test;

  # test on windows.
  npm run win-test;

  npm start;
```

# complete documentation of camo CLI functions

  <https://github.com/BananoCoin/bananojs/blob/master/docs/camo-banano-cli.md>

# complete documentation of banano CLI functions

  <https://github.com/BananoCoin/bananojs/blob/master/docs/banano-cli.md>

# complete documentation of nano CLI functions

  <https://github.com/BananoCoin/bananojs/blob/master/docs/nano-cli.md>
