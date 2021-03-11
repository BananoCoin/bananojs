# camo 1.19

## encrypted amounts

Eventually, when we figure it out, we will ty to implement bullet proofs in banano.
(We are hoping nano will do it first)
<https://github.com/PlasmaPower/orv-privacy>

## time sensitive send blocks.

Eventually we would like to support a "time sensitive send block" which will allow a user to send banano and get it refunded if a receive block is not generated within 24h.

This would require nano to implement "time as a currency" proof of work, so we are waiting for that.

## trustless swap to wax.

The main idea came from PlasmaPower's idea to do a trustless DEX with NANO and BTC.
<https://github.com/MerosCrypto/asmr>

based on monero's XMR to BTC swap
<https://arxiv.org/pdf/2101.12332.pdf>

He also described how to do a 'split key vanity', where you can generate a known public key, where the real private key is unknown, and is a combination of two private keys.

<https://raw.githubusercontent.com/PlasmaPower/curve25519-repl/master/examples/nano/secure-distributed-vanity-address-gen.txt>

So here is the idea:

Alice has Wax and wants Banano.
Bob has Banano and wants Wax.

1.  Alice creates a ECDH key pair A.
2.  Bob creates a ECDH key pair B.
3.  they share public keys.
4.  Bob calculates the split key vanity (AB) based on his private key and Alice's public key.
5.  Alice puts her WAX into a time locked smart contract that will unlock under four conditions:

    1.  REDEEM. if 2h elapses and Bob shared the private key of B, Bob can unlock the wax and send to his account. (this is the happy path, Alice has AB)
    2.  CANCEL. if 2h elapses, either Alice or Bob can send a cancel tx.

        1.  REFUND. If Alice sees CANCEL, Alice can unlock the wax by publishing a TX with private key A. This allows Bob to unlock the Banano using AB.
        2.  PUNISH. If 4h elapses, Bob can unlock the wax and send to his account. This unlocks the wax, but does not unlock the Banano.

6.  Before 1h elapses, Bob puts his Banano into AB.

7.  depending on who plays nice, several things can happen:
    1.  both parties play nice. After 1h both Banano and wax are in the accounts. After 2h Bob sends REDEEM. Bob gets wax, Alice gets Banano.
    2.  Bob does not play nice. After 2h the Banano is not in the account. Alice sends CANCEL. Alice sends REFUND. Bob should not send Bananos to AB after 1h, as after 2h Alice can CANCEL/REFUND and Bob's Banano are unrecoverable.
    3.  Alice does not play nice. Alice sees the Banano in the account and sends CANCEL but does not send REFUND. Bob should send PUNISH. Alice can prevent PUNISH by sending REFUND. Otherwise Bob gets Wax and Alice's Banano are unrecoverable.
    4.  Both parties do not play nice.
        After 1h it will be obvious to Alice if Bob is playing nice.
        After 2h, Alice or Bob can CANCEL and it will be obvious to both parties who is playing nice.
        After 4h, Bob can CANCEL/PUNISH or Alice can CANCEL/REFUND.
        If neither party plays nice, and neither party tries to cancel, the system will wait for whoever decides to move first, as both parties can retrieve the Wax at this point.

<https://github.com/BananoCoin/bananojs/blob/master/test/vanity/vanity-test-banano.js>
