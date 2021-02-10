'use strict';

// libraries
const chai = require('chai');
const nacl = require('../../libraries/tweetnacl/nacl.js');
const bananojs = require('../../index.js');
const crypto = require('crypto');

// modules
const expect = chai.expect;

// https://github.com/dchest/ed2curve-js/blob/master/ed2curve.js

const getRandomBytes32Base16 = () => {
  return crypto.randomBytes(32).toString('hex').toUpperCase();
};

const getRandomBytes24Base16 = () => {
  return crypto.randomBytes(24).toString('hex').toUpperCase();
};

const bytesToHex = bananojs.bananoUtil.bytesToHex;

const hexToBytes = bananojs.bananoUtil.hexToBytes;

describe('vanity', () => {
  describe('ed2curve', async () => {
    it('random', async () => {
    // Generate new sign key pair.
      const myKeyPair = nacl.sign.keyPair();
      const theirKeyPair = nacl.sign.keyPair();

      // Share public key with a peer.
      console.log('publicKey', bytesToHex(myKeyPair.publicKey));

      // Receive peer's public key.
      console.log('theirPublicKey', bytesToHex(theirKeyPair.publicKey));

      // Sign a message.
      const message = hexToBytes(getRandomBytes32Base16());
      const signedMessage = nacl.sign.detached(message, myKeyPair.secretKey);
      console.log('message', bytesToHex(message));
      console.log('signedMessage', bytesToHex(signedMessage));

      const verify = nacl.sign.detached.verify(message, signedMessage, myKeyPair.publicKey);
      console.log('verify', verify);
      expect(verify).to.deep.equal(true);

      // // Receive a signed message from peer and verify it using their public key.
      // const theirSignedMessage = hexToBytes(getRandomBytes32Base16());
      // const theirMessage = nacl.sign.open(theirSignedMessage, theirPublicKey);
      // console.log('theirMessage', theirMessage);

      // Encrypt a message to their public key.
      // But first, we need to convert our secret key and their public key
      // from Ed25519 into the format accepted by Curve25519.
      //
      // Note that peers are not involved in this conversion -- all they need
      // to know is the signing public key that we already shared with them.

      const myDHPublicKey = nacl.convertPublicKey(myKeyPair.publicKey);
      console.log('myDHPublicKey', bytesToHex(myDHPublicKey));
      const myDHSecretKey = nacl.convertSecretKey(myKeyPair.secretKey, false);
      console.log('myDHSecretKey', bytesToHex(myDHSecretKey));
      const myCamoPublicKeyBytes = nacl.camo.scalarMult.base( nacl.camo.hashsecret( myKeyPair.secretKey ) );
      console.log('myCamoPublicKey', bytesToHex(myCamoPublicKeyBytes));
      const theirDHPublicKey = nacl.convertPublicKey(theirKeyPair.publicKey);
      console.log('theirDHPublicKey', bytesToHex(theirDHPublicKey));
      const theirDHSecretKey = nacl.convertSecretKey(theirKeyPair.secretKey, false);
      console.log('theirDHSecretKey', bytesToHex(theirDHSecretKey));
      const theirCamoPublicKeyBytes = nacl.camo.scalarMult.base( nacl.camo.hashsecret( theirKeyPair.secretKey ) );
      console.log('theirCamoPublicKey', bytesToHex(theirCamoPublicKeyBytes));

      const secretBytes01 = nacl.camo.scalarMult( nacl.camo.hashsecret(myDHSecretKey), theirDHPublicKey );
      const secretBytes10 = nacl.camo.scalarMult( nacl.camo.hashsecret(theirDHSecretKey), myDHPublicKey );
      console.log('secretBytes01', bytesToHex(secretBytes01));
      console.log('secretBytes10', bytesToHex(secretBytes10));
    });
  });
});
