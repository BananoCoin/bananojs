# bananojs

JavaScript utilities for the banano cryptocurrency.

# simple banano functions

    const bananojs = require('bananojs');
    const crypto = require('crypto');
    const seed = crypto.randomBytes(32).toString('hex');
    const privateKey = bananojs.getPrivateKey(seed, 0);
    const publicKey = bananojs.getPublicKey(privateKey);
    const account = bananojs.getAccount(publicKey);

# complete documentation of all functions

  
