'use strict';
// libraries
const fs = require('fs');
const path = require('path');

// modules
const pjson = require('../package.json');

// constants
const inputFiles = [
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
  const directory = path.join(__dirname, '..', 'dist');
  const files = fs.readdirSync(directory);
  for (const file of files) {
    fs.unlinkSync(path.join(directory, file));
  }
  let output = '';
  output += `//bananocoin-bananojs.js\n`;
  output += `//version ${pjson.version}\n`;
  output += `//license ${pjson.license}\n`;
  output += inputFiles.map((f)=>{
    const fAbs = path.join(__dirname, f);
    return fs.readFileSync(fAbs).toString();
  }).join('');

  const file = `bananocoin-bananojs.js`;
  fs.writeFileSync(path.join(directory, file), output);
};

build();
