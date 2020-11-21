# bananojs

JavaScript utilities for the banano cryptocurrency.

make sure to use `npm i @bananocoin/bananojs@latest` to get the latest version.

# simple banano functions

    const bananojs = require('@bananocoin/bananojs');
    bananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');

    const crypto = require('crypto');
    const seed = crypto.randomBytes(32).toString('hex');
    const privateKey = bananojs.getPrivateKey(seed, 0);
    const publicKey = bananojs.getPublicKey(privateKey);
    const account = bananojs.getBananoAccount(publicKey);

    bananojs.getAccountInfo(account).then((res) => console.log(res));

# examples of most functions as part of the cli

  <https://github.com/BananoCoin/bananojs/blob/master/main.js>

# simple browser integration

  https://bananocoin.github.io/bananojs/web/

# complete documentation of all functions

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

add a new method that converts BananoParts to decimal string.
