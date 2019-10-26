# camo encrypted amounts

amounts are encrypted using the formula:

  `x` = amount.
  `a` = large prime.
  `n` = large prime.

  encryptedX =  (`x` + `a`) % `n`;

`a` and `n` are computed from blake hashing the shared secret until you find two prime numbers.

alice's old account balance is `decA0`.
alice's new account balance is `decA1`.
blake's old account balance is `decB0`.
blake's new account balance is `decB1`.

when alice sends bans she sends:
  her old encrypted amount (`encA0`).
  her new encrypted amount (`encA1`).
  her sent amount (`encTx0`).
  the modulus (`n`).

when blake receives bans he puts in the receive block:
  the old encrypted amount (`encB0`).
  the new encrypted amount (`encB1`).

the validator wants to make sure the accounts balance:
    `encA0` - `encTx0` = `encA1`
      (Alice subtracted correctly)
    `encB0` + `encTx0` = `encB1`
      (Blake added correctly)
    `encA0` + `encB0` = `encA1` + `encB1`
      (the sum of the old equals the sum of the new)
    since the validator knows `n`, it can do this calculation, mod `n`, easily.

assumptions:
1) it is cryptographically hard to create an `encA0`, `encB0`, `encA1`, `encB1`, and `encTx0` where the validator's encrypted accounts balance, but the decrypted ones do not:
    `encA0` - `encTx0` = `encA1` BUT `decA0` - `decTx0` != `decA1`
    `encB0` + `encTx0` = `encB1` BUT `decB0` + `decTx0` != `decB1`
    `encA0` + `encB0` = `encA1` + `encB1` BUT `decA0` + `decB0` != `decA1` + `decB1`
2) it is cryptographically hard to find `a` given `n`.
3) it is cryptographically hard to find the shared secret given `a` and `n`.
