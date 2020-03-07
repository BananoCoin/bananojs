'use strict';
// libraries

// modules

// constants
const files = [
  '../web/require.js',
  '../libraries/blake2b/blake2b-util.js',
  '../libraries/blake2b/blake2b.js',
  '../libraries/tweetnacl/nacl.js',
  '../app/scripts/bananode-api.js',
  '../app/scripts/logging-util.js',
  '../app/scripts/sleep-util.js',
  '../app/scripts/banano-util.js',
  '../app/scripts/deposit-util.js',
  '../app/scripts/withdraw-util.js',
  '../app/scripts/camo-util.js',
  '../index.js',
];

// variables

// functions
const build = () => {
  const output = files.map((f)=>{
    return fs.readFileSync(f).toString();
  }).join('');

  fs.writeFileSync('../dist/bananocoin-bananojs.js', output);
};

build();
