const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'bananocoin-bananojs.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals({
    whitelist: [
      'blakejs',
      '../../libraries/tweetnacl/nacl.js',
    ],
  })],
};
