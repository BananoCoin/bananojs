'use strict';
// libraries
const fs = require('fs');
const path = require('path');

// modules

// constants
const indexTsFileNm = 'index.d.ts';
const lines = [
  'export {',
  '  type Block,',
  '  Main,',
  '  CamoUtil,',
  '  BananoUtil,',
  '  WithdrawUtil,',
  '  DepositUtil,',
  '  BananodeApi,',
  '  BananoParts,',
  '  AccountValidationInfo,',
  '  BANANO_PREFIX',
  '}',
];

// variables

// functions
const build = () => {
  const fileNm = path.join(__dirname, '..', indexTsFileNm);
  const filePtr = fs.openSync(fileNm, 'a');
  for (const line of lines) {
    fs.writeSync(filePtr, line);
    fs.writeSync(filePtr, '\n');
  }
  fs.closeSync(filePtr);
};

build();
