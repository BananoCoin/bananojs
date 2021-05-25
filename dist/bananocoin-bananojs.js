//bananocoin-bananojs.js
//version 2.4.10
//license MIT
const require = (modname) => {
  if (typeof BigInt === 'undefined') {
    return;
  }
  const module = requireRaw(modname);
  if (module) {
    return module;
  } else {
    throw Error(`undefined module:'${modname}'`);
  }
};
const requireRaw = (modname) => {
  if (modname == './banano-util.js') {
    return window.bananocoin.bananojs.bananoUtil;
  }
  if (modname == './app/scripts/banano-util.js') {
    return window.bananocoin.bananojs.bananoUtil;
  }
  if (modname == './app/scripts/bananode-api.js') {
    return window.bananocoin.bananojs.bananodeApi;
  }
  if (modname == './app/scripts/camo-util.js') {
    return window.bananocoin.bananojs.camoUtil;
  }
  if (modname == './app/scripts/deposit-util.js') {
    return window.bananocoin.bananojs.depositUtil;
  }
  if (modname == './app/scripts/withdraw-util.js') {
    return window.bananocoin.bananojs.withdrawUtil;
  }
  if (modname == './app/scripts/logging-util.js') {
    return window.bananocoin.bananojs.loggingUtil;
  }
  if (modname == '../../libraries/tweetnacl/nacl.js') {
    return window.nacl;
  }
  if (modname == '../../libraries/blake2b/blake2b.js') {
    return window.blakejs;
  }
  if (modname == './blake2b-util.js') {
    return window.blakejsUtil;
  }
  if (window.bananocoin.bananojs[modname]) {
    return window.bananocoin.bananojs[modname];
  } else {
    throw Error(`unknown module:'${modname}'`);
  }
};
if (!window.bananocoin) {
  window.bananocoin = {};
}
if (!window.bananocoin.bananojs) {
  window.bananocoin.bananojs = {};
}
window.bananocoin.bananojs.http = {};
window.bananocoin.bananojs.http.request = (requestOptions, requestWriterCallback) => {
  const LOG_HTTP = false;
  const xmlhttp = new XMLHttpRequest();
  const url = 'https://' + requestOptions.hostname + requestOptions.path;
  xmlhttp.open(requestOptions.method, url, true);
  Object.keys(requestOptions.headers).forEach((headerName) => {
    if (headerName == 'Content-Length') {
      // skip unsafe header warning
    } else {
      const headerValue = requestOptions.headers[headerName];
      xmlhttp.setRequestHeader(headerName, headerValue);
    }
  });
  xmlhttp.timeout = requestOptions.timeout;

  const requestWriter = {};
  requestWriter.listeners = {};
  requestWriter.write = (body) => {
    if (LOG_HTTP) {
      console.log('https send', body);
    }
    xmlhttp.send(body);
  };
  requestWriter.end = () => {
  };
  requestWriter.listeners['end'] = () => {
  };
  requestWriter.listeners['data'] = () => {
  };
  requestWriter.listeners['error'] = () => {
  };
  requestWriter.on = (key, fn) => {
    requestWriter.listeners[key] = fn;
  };

  requestWriterCallback(requestWriter);

  const end = () => {
    const endFn = requestWriter.listeners['end'];
    endFn();
  };

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (LOG_HTTP) {
        console.log('https end', this.responseText);
      }
      if (this.status == 200) {
        const fn = requestWriter.listeners['data'];
        fn(this.responseText);
        end();
      } else {
        const fn = requestWriter.listeners['error'];
        const error = {};
        error.responseText = this.responseText;
        error.readyState = this.readyState;
        error.status = this.status;
        fn(error);
        end();
      }
    }
  };

  return requestWriter;
};
window.bananocoin.bananojs.https = {};
window.bananocoin.bananojs.https.request = (requestOptions, requestWriterCallback) => {
  const LOG_HTTP = false;
  const xmlhttp = new XMLHttpRequest();
  const url = 'https://' + requestOptions.hostname + requestOptions.path;
  xmlhttp.open(requestOptions.method, url, true);
  Object.keys(requestOptions.headers).forEach((headerName) => {
    if (headerName == 'Content-Length') {
      // skip unsafe header warning
    } else {
      const headerValue = requestOptions.headers[headerName];
      xmlhttp.setRequestHeader(headerName, headerValue);
    }
  });
  xmlhttp.timeout = requestOptions.timeout;

  const requestWriter = {};
  requestWriter.listeners = {};
  requestWriter.write = (body) => {
    if (LOG_HTTP) {
      console.log('https send', body);
    }
    xmlhttp.send(body);
  };
  requestWriter.end = () => {
  };
  requestWriter.listeners['end'] = () => {
  };
  requestWriter.listeners['data'] = () => {
  };
  requestWriter.listeners['error'] = () => {
  };
  requestWriter.on = (key, fn) => {
    requestWriter.listeners[key] = fn;
  };

  requestWriterCallback(requestWriter);

  const end = () => {
    const endFn = requestWriter.listeners['end'];
    endFn();
  };

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (LOG_HTTP) {
        console.log('https end', this.responseText);
      }
      if (this.status == 200) {
        const fn = requestWriter.listeners['data'];
        fn(this.responseText);
        end();
      } else {
        const fn = requestWriter.listeners['error'];
        const error = {};
        error.responseText = this.responseText;
        error.readyState = this.readyState;
        error.status = this.status;
        fn(error);
        end();
      }
    }
  };

  return requestWriter;
};

// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack

  const ERROR_MSG_INPUT = 'Input must be an string, Buffer or Uint8Array';

  // For convenience, let people hash a string, not just a Uint8Array
  function normalizeInput(input) {
    let ret;
    if (input instanceof Uint8Array) {
      ret = input;
    } else if (input instanceof Buffer) {
      ret = new Uint8Array(input);
    } else if (typeof (input) === 'string') {
      ret = new Uint8Array(Buffer.from(input, 'utf8'));
    } else {
      throw new Error(ERROR_MSG_INPUT);
    }
    return ret;
  }

  // Converts a Uint8Array to a hexadecimal string
  // For example, toHex([255, 0, 255]) returns "ff00ff"
  function toHex(bytes) {
    return Array.prototype.map.call(bytes, function(n) {
      return (n < 16 ? '0' : '') + n.toString(16);
    }).join('');
  }

  // Converts any value in [0...2^32-1] to an 8-character hex string
  function uint32ToHex(val) {
    return (0x100000000 + val).toString(16).substring(1);
  }

  // For debugging: prints out hash state in the same format as the RFC
  // sample computation exactly, so that you can diff
  function debugPrint(label, arr, size) {
    let msg = '\n' + label + ' = ';
    for (let i = 0; i < arr.length; i += 2) {
      if (size === 32) {
        msg += uint32ToHex(arr[i]).toUpperCase();
        msg += ' ';
        msg += uint32ToHex(arr[i + 1]).toUpperCase();
      } else if (size === 64) {
        msg += uint32ToHex(arr[i + 1]).toUpperCase();
        msg += uint32ToHex(arr[i]).toUpperCase();
      } else throw new Error('Invalid size ' + size);
      if (i % 6 === 4) {
        msg += '\n' + new Array(label.length + 4).join(' ');
      } else if (i < arr.length - 2) {
        msg += ' ';
      }
    }
    console.log(msg);
  }

  // For performance testing: generates N bytes of input, hashes M times
  // Measures and prints MB/second hash performance each time
  function testSpeed(hashFn, N, M) {
    let startMs = new Date().getTime();

    const input = new Uint8Array(N);
    for (var i = 0; i < N; i++) {
      input[i] = i % 256;
    }
    const genMs = new Date().getTime();
    console.log('Generated random input in ' + (genMs - startMs) + 'ms');
    startMs = genMs;

    for (i = 0; i < M; i++) {
      const hashHex = hashFn(input);
      const hashMs = new Date().getTime();
      const ms = hashMs - startMs;
      startMs = hashMs;
      console.log('Hashed in ' + ms + 'ms: ' + hashHex.substring(0, 20) + '...');
      console.log(Math.round(N / (1 << 20) / (ms / 1000) * 100) / 100 + ' MB PER SECOND');
    }
  }

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.normalizeInput= normalizeInput;
    exports.toHex= toHex;
    exports.debugPrint= debugPrint;
    exports.testSpeed= testSpeed;
    return exports;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.blakejsUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack

  // Blake2B in pure Javascript
  // Adapted from the reference implementation in RFC7693
  // Ported to Javascript by DC - https://github.com/dcposch

  const util = require('./blake2b-util.js');

  // 64-bit unsigned addition
  // Sets v[a,a+1] += v[b,b+1]
  // v should be a Uint32Array
  function ADD64AA(v, a, b) {
    const o0 = v[a] + v[b];
    let o1 = v[a + 1] + v[b + 1];
    if (o0 >= 0x100000000) {
      o1++;
    }
    v[a] = o0;
    v[a + 1] = o1;
  }

  // 64-bit unsigned addition
  // Sets v[a,a+1] += b
  // b0 is the low 32 bits of b, b1 represents the high 32 bits
  function ADD64AC(v, a, b0, b1) {
    let o0 = v[a] + b0;
    if (b0 < 0) {
      o0 += 0x100000000;
    }
    let o1 = v[a + 1] + b1;
    if (o0 >= 0x100000000) {
      o1++;
    }
    v[a] = o0;
    v[a + 1] = o1;
  }

  // Little-endian byte access
  function B2B_GET32(arr, i) {
    return (arr[i] ^
  (arr[i + 1] << 8) ^
  (arr[i + 2] << 16) ^
  (arr[i + 3] << 24));
  }

  // G Mixing function
  // The ROTRs are inlined for speed
  function B2B_G(a, b, c, d, ix, iy) {
    const x0 = m[ix];
    const x1 = m[ix + 1];
    const y0 = m[iy];
    const y1 = m[iy + 1];

    ADD64AA(v, a, b); // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
    ADD64AC(v, a, x0, x1); // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

    // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
    let xor0 = v[d] ^ v[a];
    let xor1 = v[d + 1] ^ v[a + 1];
    v[d] = xor1;
    v[d + 1] = xor0;

    ADD64AA(v, c, d);

    // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
    xor0 = v[b] ^ v[c];
    xor1 = v[b + 1] ^ v[c + 1];
    v[b] = (xor0 >>> 24) ^ (xor1 << 8);
    v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);

    ADD64AA(v, a, b);
    ADD64AC(v, a, y0, y1);

    // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
    xor0 = v[d] ^ v[a];
    xor1 = v[d + 1] ^ v[a + 1];
    v[d] = (xor0 >>> 16) ^ (xor1 << 16);
    v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);

    ADD64AA(v, c, d);

    // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
    xor0 = v[b] ^ v[c];
    xor1 = v[b + 1] ^ v[c + 1];
    v[b] = (xor1 >>> 31) ^ (xor0 << 1);
    v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
  }

  // Initialization Vector
  const BLAKE2B_IV32 = new Uint32Array([
    0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
    0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
    0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
    0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19,
  ]);

  const SIGMA8 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
    11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
    7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
    9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
    2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
    12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
    13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
    6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
    10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
  ];

  // These are offsets into a uint64 buffer.
  // Multiply them all by 2 to make them offsets into a uint32 buffer,
  // because this is Javascript and we don't have uint64s
  const SIGMA82 = new Uint8Array(SIGMA8.map(function(x) {
    return x * 2;
  }));

  // Compression function. 'last' flag indicates last block.
  // Note we're representing 16 uint64s as 32 uint32s
  var v = new Uint32Array(32);
  var m = new Uint32Array(32);
  function blake2bCompress(ctx, last) {
    let i = 0;

    // init work variables
    for (i = 0; i < 16; i++) {
      v[i] = ctx.h[i];
      v[i + 16] = BLAKE2B_IV32[i];
    }

    // low 64 bits of offset
    v[24] = v[24] ^ ctx.t;
    v[25] = v[25] ^ (ctx.t / 0x100000000);
    // high 64 bits not supported, offset may not be higher than 2**53-1

    // last block flag set ?
    if (last) {
      v[28] = ~v[28];
      v[29] = ~v[29];
    }

    // get little-endian words
    for (i = 0; i < 32; i++) {
      m[i] = B2B_GET32(ctx.b, 4 * i);
    }

    // twelve rounds of mixing
    // uncomment the DebugPrint calls to log the computation
    // and match the RFC sample documentation
    // util.debugPrint('          m[16]', m, 64)
    for (i = 0; i < 12; i++) {
    // util.debugPrint('   (i=' + (i < 10 ? ' ' : '') + i + ') v[16]', v, 64)
      B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
      B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
      B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
      B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
      B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
      B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
      B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
      B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
    }
    // util.debugPrint('   (i=12) v[16]', v, 64)

    for (i = 0; i < 16; i++) {
      ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
    }
  // util.debugPrint('h[8]', ctx.h, 64)
  }

  // Creates a BLAKE2b hashing context
  // Requires an output length between 1 and 64 bytes
  // Takes an optional Uint8Array key
  function blake2bInit(outlen, key) {
    if (outlen === 0 || outlen > 64) {
      throw new Error('Illegal output length, expected 0 < length <= 64');
    }
    if (key && key.length > 64) {
      throw new Error('Illegal key, expected Uint8Array with 0 < length <= 64');
    }

    // state, 'param block'
    const ctx = {
      b: new Uint8Array(128),
      h: new Uint32Array(16),
      t: 0, // input count
      c: 0, // pointer within buffer
      outlen: outlen, // output length in bytes
    };

    // initialize hash state
    for (let i = 0; i < 16; i++) {
      ctx.h[i] = BLAKE2B_IV32[i];
    }
    const keylen = key ? key.length : 0;
    ctx.h[0] ^= 0x01010000 ^ (keylen << 8) ^ outlen;

    // key the hash, if applicable
    if (key) {
      blake2bUpdate(ctx, key);
      // at the end
      ctx.c = 128;
    }

    return ctx;
  }

  // Updates a BLAKE2b streaming hash
  // Requires hash context and Uint8Array (byte array)
  function blake2bUpdate(ctx, input) {
    for (let i = 0; i < input.length; i++) {
      if (ctx.c === 128) { // buffer full ?
        ctx.t += ctx.c; // add counters
        blake2bCompress(ctx, false); // compress (not last)
        ctx.c = 0; // counter to zero
      }
      ctx.b[ctx.c++] = input[i];
    }
  }

  // Completes a BLAKE2b streaming hash
  // Returns a Uint8Array containing the message digest
  function blake2bFinal(ctx) {
    ctx.t += ctx.c; // mark last block offset

    while (ctx.c < 128) { // fill up with zeros
      ctx.b[ctx.c++] = 0;
    }
    blake2bCompress(ctx, true); // final block flag = 1

    // little endian convert and store
    const out = new Uint8Array(ctx.outlen);
    for (let i = 0; i < ctx.outlen; i++) {
      out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
    }
    return out;
  }

  // Computes the BLAKE2B hash of a string or byte array, and returns a Uint8Array
  //
  // Returns a n-byte Uint8Array
  //
  // Parameters:
  // - input - the input bytes, as a string, Buffer or Uint8Array
  // - key - optional key Uint8Array, up to 64 bytes
  // - outlen - optional output length in bytes, default 64
  function blake2b(input, key, outlen) {
  // preprocess inputs
    outlen = outlen || 64;
    input = util.normalizeInput(input);

    // do the math
    const ctx = blake2bInit(outlen, key);
    blake2bUpdate(ctx, input);
    return blake2bFinal(ctx);
  }

  // Computes the BLAKE2B hash of a string or byte array
  //
  // Returns an n-byte hash in hex, all lowercase
  //
  // Parameters:
  // - input - the input bytes, as a string, Buffer, or Uint8Array
  // - key - optional key Uint8Array, up to 64 bytes
  // - outlen - optional output length in bytes, default 64
  function blake2bHex(input, key, outlen) {
    const output = blake2b(input, key, outlen);
    return util.toHex(output);
  }


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.blake2b= blake2b;
    exports.blake2bHex= blake2bHex;
    exports.blake2bInit= blake2bInit;
    exports.blake2bUpdate= blake2bUpdate;
    exports.blake2bFinal= blake2bFinal;
    return exports;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.blakejs = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';


// STARTED TOP nodejs/browser hack
(function() {
  const exports = (() => {
    const exports = {};
    // FINISHED TOP nodejs/browser hack
    const blake = require('../../libraries/blake2b/blake2b.js');

    // Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
    // Public domain.
    //
    // Implementation derived from TweetNaCl version 20140427.
    // See for details: http://tweetexports.cr.yp.to/

    const u64 = function(h, l) {
      this.hi = h | 0 >>> 0;
      this.lo = l | 0 >>> 0;
    };
    const gf = function(init) {
      let i; const r = new Float64Array(16);
      if (init) {
        for (i = 0; i < init.length; i++) {
          r[i] = init[i];
        }
      }
      return r;
    };

    // Pluggable, initialized in high-level API below.
    let randombytes = function(/* x, n */) {
      throw new Error('no PRNG');
    };

    const _0 = new Uint8Array(16);
    const _9 = new Uint8Array(32);
    _9[0] = 9;

    const gf0 = gf(); const gf1 = gf([1]); const _121665 = gf([0xdb41, 1]); const D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079,
      0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]); const D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e,
      0xfce7, 0x56df, 0xd9dc, 0x2406]); const X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e,
      0x36d3, 0x2169]); const Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]); const I = gf([
      0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

    function L32(x, c) {
      return (x << c) | (x >>> (32 - c));
    }

    function ld32(x, i) {
      let u = x[i + 3] & 0xff;
      u = (u << 8) | (x[i + 2] & 0xff);
      u = (u << 8) | (x[i + 1] & 0xff);
      return (u << 8) | (x[i + 0] & 0xff);
    }

    function dl64(x, i) {
      const h = (x[i] << 24) | (x[i + 1] << 16) | (x[i + 2] << 8) | x[i + 3];
      const l = (x[i + 4] << 24) | (x[i + 5] << 16) | (x[i + 6] << 8) | x[i + 7];
      return new u64(h, l);
    }

    function st32(x, j, u) {
      let i;
      for (i = 0; i < 4; i++) {
        x[j + i] = u & 255;
        u >>>= 8;
      }
    }

    function ts64(x, i, u) {
      x[i] = (u.hi >> 24) & 0xff;
      x[i + 1] = (u.hi >> 16) & 0xff;
      x[i + 2] = (u.hi >> 8) & 0xff;
      x[i + 3] = u.hi & 0xff;
      x[i + 4] = (u.lo >> 24) & 0xff;
      x[i + 5] = (u.lo >> 16) & 0xff;
      x[i + 6] = (u.lo >> 8) & 0xff;
      x[i + 7] = u.lo & 0xff;
    }

    function vn(x, xi, y, yi, n) {
      let i; let d = 0;
      for (i = 0; i < n; i++) {
        d |= x[xi + i] ^ y[yi + i];
      }
      return (1 & ((d - 1) >>> 8)) - 1;
    }

    function crypto_verify_16(x, xi, y, yi) {
      return vn(x, xi, y, yi, 16);
    }

    function crypto_verify_32(x, xi, y, yi) {
      return vn(x, xi, y, yi, 32);
    }

    function core(out, inp, k, c, h) {
      const w = new Uint32Array(16); const x = new Uint32Array(16); const y = new Uint32Array(16); const t = new Uint32Array(4);
      let i; let j; let m;

      for (i = 0; i < 4; i++) {
        x[5 * i] = ld32(c, 4 * i);
        x[1 + i] = ld32(k, 4 * i);
        x[6 + i] = ld32(inp, 4 * i);
        x[11 + i] = ld32(k, 16 + 4 * i);
      }

      for (i = 0; i < 16; i++) {
        y[i] = x[i];
      }

      for (i = 0; i < 20; i++) {
        for (j = 0; j < 4; j++) {
          for (m = 0; m < 4; m++) {
            t[m] = x[(5 * j + 4 * m) % 16];
          }
          t[1] ^= L32((t[0] + t[3]) | 0, 7);
          t[2] ^= L32((t[1] + t[0]) | 0, 9);
          t[3] ^= L32((t[2] + t[1]) | 0, 13);
          t[0] ^= L32((t[3] + t[2]) | 0, 18);
          for (m = 0; m < 4; m++) {
            w[4 * j + (j + m) % 4] = t[m];
          }
        }
        for (m = 0; m < 16; m++) {
          x[m] = w[m];
        }
      }

      if (h) {
        for (i = 0; i < 16; i++) {
          x[i] = (x[i] + y[i]) | 0;
        }
        for (i = 0; i < 4; i++) {
          x[5 * i] = (x[5 * i] - ld32(c, 4 * i)) | 0;
          x[6 + i] = (x[6 + i] - ld32(inp, 4 * i)) | 0;
        }
        for (i = 0; i < 4; i++) {
          st32(out, 4 * i, x[5 * i]);
          st32(out, 16 + 4 * i, x[6 + i]);
        }
      } else {
        for (i = 0; i < 16; i++) {
          st32(out, 4 * i, (x[i] + y[i]) | 0);
        }
      }
    }

    function crypto_core_salsa20(out, inp, k, c) {
      core(out, inp, k, c, false);
      return 0;
    }

    function crypto_core_hsalsa20(out, inp, k, c) {
      core(out, inp, k, c, true);
      return 0;
    }

    const sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    // "expand 32-byte k"

    function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
      const z = new Uint8Array(16); const x = new Uint8Array(64);
      let u; let i;
      if (!b) {
        return 0;
      }
      for (i = 0; i < 16; i++) {
        z[i] = 0;
      }
      for (i = 0; i < 8; i++) {
        z[i] = n[i];
      }
      while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++) {
          c[cpos + i] = (m ? m[mpos + i] : 0) ^ x[i];
        }
        u = 1;
        for (i = 8; i < 16; i++) {
          u = u + (z[i] & 0xff) | 0;
          z[i] = u & 0xff;
          u >>>= 8;
        }
        b -= 64;
        cpos += 64;
        if (m) {
          mpos += 64;
        }
      }
      if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++) {
          c[cpos + i] = (m ? m[mpos + i] : 0) ^ x[i];
        }
      }
      return 0;
    }

    function crypto_stream_salsa20(c, cpos, d, n, k) {
      return crypto_stream_salsa20_xor(c, cpos, null, 0, d, n, k);
    }

    function crypto_stream(c, cpos, d, n, k) {
      const s = new Uint8Array(32);
      crypto_core_hsalsa20(s, n, k, sigma);
      return crypto_stream_salsa20(c, cpos, d, n.subarray(16), s);
    }

    function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
      const s = new Uint8Array(32);
      crypto_core_hsalsa20(s, n, k, sigma);
      return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, n.subarray(16), s);
    }

    function add1305(h, c) {
      let j; let u = 0;
      for (j = 0; j < 17; j++) {
        u = (u + ((h[j] + c[j]) | 0)) | 0;
        h[j] = u & 255;
        u >>>= 8;
      }
    }

    const minusp = new Uint32Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 252]);

    function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
      let s; let i; let j; let u;
      const x = new Uint32Array(17); const r = new Uint32Array(17); const h = new Uint32Array(17); const c = new Uint32Array(17); const g = new Uint32Array(17);
      for (j = 0; j < 17; j++) {
        r[j] = h[j] = 0;
      }
      for (j = 0; j < 16; j++) {
        r[j] = k[j];
      }
      r[3] &= 15;
      r[4] &= 252;
      r[7] &= 15;
      r[8] &= 252;
      r[11] &= 15;
      r[12] &= 252;
      r[15] &= 15;

      while (n > 0) {
        for (j = 0; j < 17; j++) {
          c[j] = 0;
        }
        for (j = 0; (j < 16) && (j < n); ++j) {
          c[j] = m[mpos + j];
        }
        c[j] = 1;
        mpos += j;
        n -= j;
        add1305(h, c);
        for (i = 0; i < 17; i++) {
          x[i] = 0;
          for (j = 0; j < 17; j++) {
            x[i] = (x[i] + (h[j] * ((j <= i) ? r[i - j] : ((320 * r[i + 17 - j]) | 0))) | 0) | 0;
          }
        }
        for (i = 0; i < 17; i++) {
          h[i] = x[i];
        }
        u = 0;
        for (j = 0; j < 16; j++) {
          u = (u + h[j]) | 0;
          h[j] = u & 255;
          u >>>= 8;
        }
        u = (u + h[16]) | 0;
        h[16] = u & 3;
        u = (5 * (u >>> 2)) | 0;
        for (j = 0; j < 16; j++) {
          u = (u + h[j]) | 0;
          h[j] = u & 255;
          u >>>= 8;
        }
        u = (u + h[16]) | 0;
        h[16] = u;
      }

      for (j = 0; j < 17; j++) {
        g[j] = h[j];
      }
      add1305(h, minusp);
      s = (-(h[16] >>> 7) | 0);
      for (j = 0; j < 17; j++) {
        h[j] ^= s & (g[j] ^ h[j]);
      }

      for (j = 0; j < 16; j++) {
        c[j] = k[j + 16];
      }
      c[16] = 0;
      add1305(h, c);
      for (j = 0; j < 16; j++) {
        out[outpos + j] = h[j];
      }
      return 0;
    }

    function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
      const x = new Uint8Array(16);
      crypto_onetimeauth(x, 0, m, mpos, n, k);
      return crypto_verify_16(h, hpos, x, 0);
    }

    function crypto_secretbox(c, m, d, n, k) {
      let i;
      if (d < 32) {
        return -1;
      }
      crypto_stream_xor(c, 0, m, 0, d, n, k);
      crypto_onetimeauth(c, 16, c, 32, d - 32, c);
      for (i = 0; i < 16; i++) {
        c[i] = 0;
      }
      return 0;
    }

    function crypto_secretbox_open(m, c, d, n, k) {
      let i;
      const x = new Uint8Array(32);
      if (d < 32) {
        return -1;
      }
      crypto_stream(x, 0, 32, n, k);
      if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) {
        return -1;
      }
      crypto_stream_xor(m, 0, c, 0, d, n, k);
      for (i = 0; i < 32; i++) {
        m[i] = 0;
      }
      return 0;
    }

    function set25519(r, a) {
      let i;
      for (i = 0; i < 16; i++) {
        r[i] = a[i] | 0;
      }
    }

    function car25519(o) {
      let c;
      let i;
      for (i = 0; i < 16; i++) {
        o[i] += 65536;
        c = Math.floor(o[i] / 65536);
        o[(i + 1) * (i < 15 ? 1 : 0)] += c - 1 + 37 * (c - 1) * (i === 15 ? 1 : 0);
        o[i] -= (c * 65536);
      }
    }

    function sel25519(p, q, b) {
      let t; const c = ~(b - 1);
      for (let i = 0; i < 16; i++) {
        t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
      }
    }

    function pack25519(o, n) {
      let i; let j; let b;
      const m = gf(); const t = gf();
      for (i = 0; i < 16; i++) {
        t[i] = n[i];
      }
      car25519(t);
      car25519(t);
      car25519(t);
      for (j = 0; j < 2; j++) {
        m[0] = t[0] - 0xffed;
        for (i = 1; i < 15; i++) {
          m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
          m[i - 1] &= 0xffff;
        }
        m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
        b = (m[15] >> 16) & 1;
        m[14] &= 0xffff;
        sel25519(t, m, 1 - b);
      }
      for (i = 0; i < 16; i++) {
        o[2 * i] = t[i] & 0xff;
        o[2 * i + 1] = t[i] >> 8;
      }
    }

    function neq25519(a, b) {
      const c = new Uint8Array(32); const d = new Uint8Array(32);
      pack25519(c, a);
      pack25519(d, b);
      return crypto_verify_32(c, 0, d, 0);
    }

    function par25519(a) {
      const d = new Uint8Array(32);
      pack25519(d, a);
      return d[0] & 1;
    }

    function unpack25519(o, n) {
      let i;
      for (i = 0; i < 16; i++) {
        o[i] = n[2 * i] + (n[2 * i + 1] << 8);
      }
      o[15] &= 0x7fff;
    }

    function A(o, a, b) {
      let i;
      for (i = 0; i < 16; i++) {
        o[i] = (a[i] + b[i]) | 0;
      }
    }

    function Z(o, a, b) {
      let i;
      for (i = 0; i < 16; i++) {
        o[i] = (a[i] - b[i]) | 0;
      }
    }

    function M(o, a, b) {
      let i; let j; const t = new Float64Array(31);
      for (i = 0; i < 31; i++) {
        t[i] = 0;
      }
      for (i = 0; i < 16; i++) {
        for (j = 0; j < 16; j++) {
          t[i + j] += a[i] * b[j];
        }
      }
      for (i = 0; i < 15; i++) {
        t[i] += 38 * t[i + 16];
      }
      for (i = 0; i < 16; i++) {
        o[i] = t[i];
      }
      car25519(o);
      car25519(o);
    }

    function S(o, a) {
      M(o, a, a);
    }

    function inv25519(o, i) {
      const c = gf();
      let a;
      for (a = 0; a < 16; a++) {
        c[a] = i[a];
      }
      for (a = 253; a >= 0; a--) {
        S(c, c);
        if (a !== 2 && a !== 4) {
          M(c, c, i);
        }
      }
      for (a = 0; a < 16; a++) {
        o[a] = c[a];
      }
    }

    function pow2523(o, i) {
      const c = gf();
      let a;
      for (a = 0; a < 16; a++) {
        c[a] = i[a];
      }
      for (a = 250; a >= 0; a--) {
        S(c, c);
        if (a !== 1) {
          M(c, c, i);
        }
      }
      for (a = 0; a < 16; a++) {
        o[a] = c[a];
      }
    }

    function crypto_scalarmult(q, n, p) {
      const z = new Uint8Array(32);
      const x = new Float64Array(80); let r; let i;
      const a = gf(); const b = gf(); const c = gf(); const d = gf(); const e = gf(); const f = gf();
      for (i = 0; i < 31; i++) {
        z[i] = n[i];
      }
      z[31] = (n[31] & 127) | 64;
      z[0] &= 248;
      unpack25519(x, p);
      for (i = 0; i < 16; i++) {
        b[i] = x[i];
        d[i] = a[i] = c[i] = 0;
      }
      a[0] = d[0] = 1;
      for (i = 254; i >= 0; --i) {
        r = (z[i >>> 3] >>> (i & 7)) & 1;
        sel25519(a, b, r);
        sel25519(c, d, r);
        A(e, a, c);
        Z(a, a, c);
        A(c, b, d);
        Z(b, b, d);
        S(d, e);
        S(f, a);
        M(a, c, a);
        M(c, b, e);
        A(e, a, c);
        Z(a, a, c);
        S(b, a);
        Z(c, d, f);
        M(a, c, _121665);
        A(a, a, d);
        M(c, c, a);
        M(a, d, f);
        M(d, b, x);
        S(b, e);
        sel25519(a, b, r);
        sel25519(c, d, r);
      }
      for (i = 0; i < 16; i++) {
        x[i + 16] = a[i];
        x[i + 32] = c[i];
        x[i + 48] = b[i];
        x[i + 64] = d[i];
      }
      const x32 = x.subarray(32);
      const x16 = x.subarray(16);
      inv25519(x32, x32);
      M(x16, x16, x32);
      pack25519(q, x16);
      return 0;
    }

    function crypto_scalarmult_base(q, n) {
      return crypto_scalarmult(q, n, _9);
    }

    function crypto_box_keypair(y, x) {
      randombytes(x, 32);
      return crypto_scalarmult_base(y, x);
    }

    function crypto_box_beforenm(k, y, x) {
      const s = new Uint8Array(32);
      crypto_scalarmult(s, x, y);
      return crypto_core_hsalsa20(k, _0, s, sigma);
    }

    const crypto_box_afternm = crypto_secretbox;
    const crypto_box_open_afternm = crypto_secretbox_open;

    function crypto_box(c, m, d, n, y, x) {
      const k = new Uint8Array(32);
      crypto_box_beforenm(k, y, x);
      return crypto_box_afternm(c, m, d, n, k);
    }

    function crypto_box_open(m, c, d, n, y, x) {
      const k = new Uint8Array(32);
      crypto_box_beforenm(k, y, x);
      return crypto_box_open_afternm(m, c, d, n, k);
    }

    function add64() {
      let a = 0; let b = 0; let c = 0; let d = 0; const m16 = 65535; let l; let h; let i;
      for (i = 0; i < arguments.length; i++) {
        l = arguments[i].lo;
        h = arguments[i].hi;
        a += (l & m16);
        b += (l >>> 16);
        c += (h & m16);
        d += (h >>> 16);
      }

      b += (a >>> 16);
      c += (b >>> 16);
      d += (c >>> 16);

      return new u64((c & m16) | (d << 16), (a & m16) | (b << 16));
    }

    function shr64(x, c) {
      return new u64((x.hi >>> c), (x.lo >>> c) | (x.hi << (32 - c)));
    }

    function xor64() {
      let l = 0; let h = 0; let i;
      for (i = 0; i < arguments.length; i++) {
        l ^= arguments[i].lo;
        h ^= arguments[i].hi;
      }
      return new u64(h, l);
    }

    function R(x, c) {
      let h; let l; const c1 = 32 - c;
      if (c < 32) {
        h = (x.hi >>> c) | (x.lo << c1);
        l = (x.lo >>> c) | (x.hi << c1);
      } else if (c < 64) {
        h = (x.lo >>> c) | (x.hi << c1);
        l = (x.hi >>> c) | (x.lo << c1);
      }
      return new u64(h, l);
    }

    function Ch(x, y, z) {
      const h = (x.hi & y.hi) ^ (~x.hi & z.hi); const l = (x.lo & y.lo) ^ (~x.lo & z.lo);
      return new u64(h, l);
    }

    function Maj(x, y, z) {
      const h = (x.hi & y.hi) ^ (x.hi & z.hi) ^ (y.hi & z.hi); const l = (x.lo & y.lo) ^ (x.lo & z.lo) ^ (y.lo & z.lo);
      return new u64(h, l);
    }

    function Sigma0(x) {
      return xor64(R(x, 28), R(x, 34), R(x, 39));
    }
    function Sigma1(x) {
      return xor64(R(x, 14), R(x, 18), R(x, 41));
    }
    function sigma0(x) {
      return xor64(R(x, 1), R(x, 8), shr64(x, 7));
    }
    function sigma1(x) {
      return xor64(R(x, 19), R(x, 61), shr64(x, 6));
    }

    const K = [new u64(0x428a2f98, 0xd728ae22), new u64(0x71374491, 0x23ef65cd), new u64(0xb5c0fbcf, 0xec4d3b2f), new u64(0xe9b5dba5, 0x8189dbbc),
      new u64(0x3956c25b, 0xf348b538), new u64(0x59f111f1, 0xb605d019), new u64(0x923f82a4, 0xaf194f9b), new u64(0xab1c5ed5, 0xda6d8118),
      new u64(0xd807aa98, 0xa3030242), new u64(0x12835b01, 0x45706fbe), new u64(0x243185be, 0x4ee4b28c), new u64(0x550c7dc3, 0xd5ffb4e2),
      new u64(0x72be5d74, 0xf27b896f), new u64(0x80deb1fe, 0x3b1696b1), new u64(0x9bdc06a7, 0x25c71235), new u64(0xc19bf174, 0xcf692694),
      new u64(0xe49b69c1, 0x9ef14ad2), new u64(0xefbe4786, 0x384f25e3), new u64(0x0fc19dc6, 0x8b8cd5b5), new u64(0x240ca1cc, 0x77ac9c65),
      new u64(0x2de92c6f, 0x592b0275), new u64(0x4a7484aa, 0x6ea6e483), new u64(0x5cb0a9dc, 0xbd41fbd4), new u64(0x76f988da, 0x831153b5),
      new u64(0x983e5152, 0xee66dfab), new u64(0xa831c66d, 0x2db43210), new u64(0xb00327c8, 0x98fb213f), new u64(0xbf597fc7, 0xbeef0ee4),
      new u64(0xc6e00bf3, 0x3da88fc2), new u64(0xd5a79147, 0x930aa725), new u64(0x06ca6351, 0xe003826f), new u64(0x14292967, 0x0a0e6e70),
      new u64(0x27b70a85, 0x46d22ffc), new u64(0x2e1b2138, 0x5c26c926), new u64(0x4d2c6dfc, 0x5ac42aed), new u64(0x53380d13, 0x9d95b3df),
      new u64(0x650a7354, 0x8baf63de), new u64(0x766a0abb, 0x3c77b2a8), new u64(0x81c2c92e, 0x47edaee6), new u64(0x92722c85, 0x1482353b),
      new u64(0xa2bfe8a1, 0x4cf10364), new u64(0xa81a664b, 0xbc423001), new u64(0xc24b8b70, 0xd0f89791), new u64(0xc76c51a3, 0x0654be30),
      new u64(0xd192e819, 0xd6ef5218), new u64(0xd6990624, 0x5565a910), new u64(0xf40e3585, 0x5771202a), new u64(0x106aa070, 0x32bbd1b8),
      new u64(0x19a4c116, 0xb8d2d0c8), new u64(0x1e376c08, 0x5141ab53), new u64(0x2748774c, 0xdf8eeb99), new u64(0x34b0bcb5, 0xe19b48a8),
      new u64(0x391c0cb3, 0xc5c95a63), new u64(0x4ed8aa4a, 0xe3418acb), new u64(0x5b9cca4f, 0x7763e373), new u64(0x682e6ff3, 0xd6b2b8a3),
      new u64(0x748f82ee, 0x5defb2fc), new u64(0x78a5636f, 0x43172f60), new u64(0x84c87814, 0xa1f0ab72), new u64(0x8cc70208, 0x1a6439ec),
      new u64(0x90befffa, 0x23631e28), new u64(0xa4506ceb, 0xde82bde9), new u64(0xbef9a3f7, 0xb2c67915), new u64(0xc67178f2, 0xe372532b),
      new u64(0xca273ece, 0xea26619c), new u64(0xd186b8c7, 0x21c0c207), new u64(0xeada7dd6, 0xcde0eb1e), new u64(0xf57d4f7f, 0xee6ed178),
      new u64(0x06f067aa, 0x72176fba), new u64(0x0a637dc5, 0xa2c898a6), new u64(0x113f9804, 0xbef90dae), new u64(0x1b710b35, 0x131c471b),
      new u64(0x28db77f5, 0x23047d84), new u64(0x32caab7b, 0x40c72493), new u64(0x3c9ebe0a, 0x15c9bebc), new u64(0x431d67c4, 0x9c100d4c),
      new u64(0x4cc5d4be, 0xcb3e42b6), new u64(0x597f299c, 0xfc657e2a), new u64(0x5fcb6fab, 0x3ad6faec), new u64(0x6c44198c, 0x4a475817)];

    function crypto_hashblocks(x, m, n) {
      const z = []; const b = []; const a = []; const w = []; let t; let i; let j;

      for (i = 0; i < 8; i++) {
        z[i] = a[i] = dl64(x, 8 * i);
      }

      let pos = 0;
      while (n >= 128) {
        for (i = 0; i < 16; i++) {
          w[i] = dl64(m, 8 * i + pos);
        }
        for (i = 0; i < 80; i++) {
          for (j = 0; j < 8; j++) {
            b[j] = a[j];
          }
          t = add64(a[7], Sigma1(a[4]), Ch(a[4], a[5], a[6]), K[i], w[i % 16]);
          b[7] = add64(t, Sigma0(a[0]), Maj(a[0], a[1], a[2]));
          b[3] = add64(b[3], t);
          for (j = 0; j < 8; j++) {
            a[(j + 1) % 8] = b[j];
          }
          if (i % 16 === 15) {
            for (j = 0; j < 16; j++) {
              w[j] = add64(w[j], w[(j + 9) % 16], sigma0(w[(j + 1) % 16]), sigma1(w[(j + 14) % 16]));
            }
          }
        }

        for (i = 0; i < 8; i++) {
          a[i] = add64(a[i], z[i]);
          z[i] = a[i];
        }

        pos += 128;
        n -= 128;
      }

      for (i = 0; i < 8; i++) {
        ts64(x, 8 * i, z[i]);
      }
      return n;
    }

    const iv = new Uint8Array([0x6a, 0x09, 0xe6, 0x67, 0xf3, 0xbc, 0xc9, 0x08, 0xbb, 0x67, 0xae, 0x85, 0x84, 0xca, 0xa7, 0x3b, 0x3c, 0x6e, 0xf3, 0x72, 0xfe, 0x94,
      0xf8, 0x2b, 0xa5, 0x4f, 0xf5, 0x3a, 0x5f, 0x1d, 0x36, 0xf1, 0x51, 0x0e, 0x52, 0x7f, 0xad, 0xe6, 0x82, 0xd1, 0x9b, 0x05, 0x68, 0x8c, 0x2b, 0x3e, 0x6c, 0x1f,
      0x1f, 0x83, 0xd9, 0xab, 0xfb, 0x41, 0xbd, 0x6b, 0x5b, 0xe0, 0xcd, 0x19, 0x13, 0x7e, 0x21, 0x79]);

    function crypto_hash(out, m, n) {
      const h = new Uint8Array(64); const x = new Uint8Array(256);
      let i; const b = n;

      for (i = 0; i < 64; i++) {
        h[i] = iv[i];
      }

      crypto_hashblocks(h, m, n);
      n %= 128;

      for (i = 0; i < 256; i++) {
        x[i] = 0;
      }
      for (i = 0; i < n; i++) {
        x[i] = m[b - n + i];
      }
      x[n] = 128;

      n = 256 - 128 * (n < 112 ? 1 : 0);
      x[n - 9] = 0;
      ts64(x, n - 8, new u64((b / 0x20000000) | 0, b << 3));
      crypto_hashblocks(h, x, n);

      for (i = 0; i < 64; i++) {
        out[i] = h[i];
      }

      return 0;
    }

    function add(p, q) {
      const a = gf(); const b = gf(); const c = gf(); const d = gf(); const e = gf(); const f = gf(); const g = gf(); const h = gf(); const t = gf();

      Z(a, p[1], p[0]);
      Z(t, q[1], q[0]);
      M(a, a, t);
      A(b, p[0], p[1]);
      A(t, q[0], q[1]);
      M(b, b, t);
      M(c, p[3], q[3]);
      M(c, c, D2);
      M(d, p[2], q[2]);
      A(d, d, d);
      Z(e, b, a);
      Z(f, d, c);
      A(g, d, c);
      A(h, b, a);

      M(p[0], e, f);
      M(p[1], h, g);
      M(p[2], g, f);
      M(p[3], e, h);
    }

    function cswap(p, q, b) {
      let i;
      for (i = 0; i < 4; i++) {
        sel25519(p[i], q[i], b);
      }
    }

    function pack(r, p) {
      const tx = gf(); const ty = gf(); const zi = gf();
      inv25519(zi, p[2]);
      M(tx, p[0], zi);
      M(ty, p[1], zi);
      pack25519(r, ty);
      r[31] ^= par25519(tx) << 7;
    }

    function scalarmult(p, q, s) {
      let b; let i;
      set25519(p[0], gf0);
      set25519(p[1], gf1);
      set25519(p[2], gf1);
      set25519(p[3], gf0);
      for (i = 255; i >= 0; --i) {
        b = (s[(i / 8) | 0] >> (i & 7)) & 1;
        cswap(p, q, b);
        add(q, p);
        add(p, p);
        cswap(p, q, b);
      }
    }

    function scalarbase(p, s) {
      const q = [gf(), gf(), gf(), gf()];
      set25519(q[0], X);
      set25519(q[1], Y);
      set25519(q[2], gf1);
      M(q[3], X, Y);
      scalarmult(p, q, s);
    }

    function crypto_sign_keypair(pk, sk, seeded) {
      let d = new Uint8Array(64);
      const p = [gf(), gf(), gf(), gf()];
      let i;

      if (!seeded) {
        randombytes(sk, 32);
      }

      const context = blake.blake2bInit(64);
      blake.blake2bUpdate(context, sk);
      d = blake.blake2bFinal(context);

      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;

      scalarbase(p, d);
      pack(pk, p);

      return 0;
    }

    const hashSecret = ( sk ) => {
      let d = new Uint8Array( 64 );
      const pk = new Uint8Array( 32 );
      const context = blake.blake2bInit( 64 );
      blake.blake2bUpdate( context, sk );
      d = blake.blake2bFinal( context );
      return d;
    };

    exports.camo = {};
    exports.camo.hashsecret = hashSecret;

    exports.camo.scalarMult = function(n, p) {
      checkArrayTypes(n, p);
      if (n.length !== crypto_scalarmult_SCALARBYTES * 2) {
        throw new Error('bad n size');
      }
      if (p.length !== crypto_scalarmult_BYTES) {
        throw new Error('bad p size');
      }
      const q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult(q, n, p);
      return q;
    };

    exports.camo.scalarMult.base = function(n) {
      checkArrayTypes(n);
      if (n.length !== crypto_scalarmult_SCALARBYTES*2) {
        throw new Error('bad n size');
      }
      const q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult_base(q, n);
      return q;
    };

    exports.camo.scalarbase = deriveUnhashedPublicFromSecret;

    function deriveUnhashedPublicFromSecret(sk) {
      const d = sk;
      const p = [gf(), gf(), gf(), gf()];
      let i;
      const pk = new Uint8Array(32);

      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;

      scalarbase(p, d);
      pack(pk, p);
      return pk;
    }

    function derivePublicFromSecret(sk) {
      let d = new Uint8Array(64);
      const p = [gf(), gf(), gf(), gf()];
      let i;
      const pk = new Uint8Array(32);
      const context = blake.blake2bInit(64);
      blake.blake2bUpdate(context, sk);
      d = blake.blake2bFinal(context);

      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;

      scalarbase(p, d);
      pack(pk, p);
      return pk;
    }

    const L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0x10]);

    function modL(r, x) {
      let carry; let i; let j; let k;
      for (i = 63; i >= 32; --i) {
        carry = 0;
        for (j = i - 32, k = i - 12; j < k; ++j) {
          x[j] += carry - 16 * x[i] * L[j - (i - 32)];
          carry = (x[j] + 128) >> 8;
          x[j] -= carry * 256;
        }
        x[j] += carry;
        x[i] = 0;
      }
      carry = 0;
      for (j = 0; j < 32; j++) {
        x[j] += carry - (x[31] >> 4) * L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
      }
      for (j = 0; j < 32; j++) {
        x[j] -= carry * L[j];
      }
      for (i = 0; i < 32; i++) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] & 255;
      }
    }

    function reduce(r) {
      const x = new Float64Array(64); let i;
      for (i = 0; i < 64; i++) {
        x[i] = r[i];
      }
      for (i = 0; i < 64; i++) {
        r[i] = 0;
      }
      modL(r, x);
    }

    // Note: difference from C - smlen returned, not passed as argument.
    function crypto_sign(sm, m, n, sk) {
      let d = new Uint8Array(64); let h = new Uint8Array(64); let r = new Uint8Array(64);
      let i; let j; const x = new Float64Array(64);
      const p = [gf(), gf(), gf(), gf()];

      const pk = derivePublicFromSecret(sk);

      let context = blake.blake2bInit(64, null);
      blake.blake2bUpdate(context, sk);
      d = blake.blake2bFinal(context);
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;

      const smlen = n + 64;
      for (i = 0; i < n; i++) {
        sm[64 + i] = m[i];
      }
      for (i = 0; i < 32; i++) {
        sm[32 + i] = d[32 + i];
      }

      context = blake.blake2bInit(64, null);
      blake.blake2bUpdate(context, sm.subarray(32));
      r = blake.blake2bFinal(context);

      reduce(r);
      scalarbase(p, r);
      pack(sm, p);

      for (i = 32; i < 64; i++) {
        sm[i] = pk[i - 32];
      }

      context = blake.blake2bInit(64, null);
      blake.blake2bUpdate(context, sm);
      h = blake.blake2bFinal(context);

      reduce(h);

      for (i = 0; i < 64; i++) {
        x[i] = 0;
      }
      for (i = 0; i < 32; i++) {
        x[i] = r[i];
      }
      for (i = 0; i < 32; i++) {
        for (j = 0; j < 32; j++) {
          x[i + j] += h[i] * d[j];
        }
      }

      modL(sm.subarray(32), x);
      return smlen;
    }

    function unpackneg(r, p) {
      const t = gf(); const chk = gf(); const num = gf(); const den = gf(); const den2 = gf(); const den4 = gf(); const den6 = gf();

      set25519(r[2], gf1);
      unpack25519(r[1], p);
      S(num, r[1]);
      M(den, num, D);
      Z(num, num, r[2]);
      A(den, r[2], den);

      S(den2, den);
      S(den4, den2);
      M(den6, den4, den2);
      M(t, den6, num);
      M(t, t, den);

      pow2523(t, t);
      M(t, t, num);
      M(t, t, den);
      M(t, t, den);
      M(r[0], t, den);

      S(chk, r[0]);
      M(chk, chk, den);
      if (neq25519(chk, num)) {
        M(r[0], r[0], I);
      }

      S(chk, r[0]);
      M(chk, chk, den);
      if (neq25519(chk, num)) {
        return -1;
      }

      if (par25519(r[0]) === (p[31] >> 7)) {
        Z(r[0], gf0, r[0]);
      }

      M(r[3], r[0], r[1]);
      return 0;
    }

    function crypto_sign_open(m, sm, n, pk) {
      let i; let mlen;
      const t = new Uint8Array(32); let h = new Uint8Array(64);
      const p = [gf(), gf(), gf(), gf()]; const q = [gf(), gf(), gf(), gf()];

      mlen = -1;
      if (n < 64) {
        return -1;
      }

      if (unpackneg(q, pk)) {
        return -1;
      }

      for (i = 0; i < n; i++) {
        m[i] = sm[i];
      }
      for (i = 0; i < 32; i++) {
        m[i + 32] = pk[i];
      }
      // crypto_hash(h, m, n);

      context = blake.blake2bInit(64, null);
      blake.blake2bUpdate(context, m);
      h = blake.blake2bFinal(context);

      reduce(h);
      scalarmult(p, q, h);

      scalarbase(q, sm.subarray(32));
      add(p, q);
      pack(t, p);

      n -= 64;
      if (crypto_verify_32(sm, 0, t, 0)) {
        for (i = 0; i < n; i++) {
          m[i] = 0;
        }
        return -1;
      }

      for (i = 0; i < n; i++) {
        m[i] = sm[i + 64];
      }
      mlen = n;
      return mlen;
    }

    const crypto_secretbox_KEYBYTES = 32; const crypto_secretbox_NONCEBYTES = 24; const crypto_secretbox_ZEROBYTES = 32; const crypto_secretbox_BOXZEROBYTES = 16; var crypto_scalarmult_BYTES = 32; var crypto_scalarmult_SCALARBYTES = 32; const crypto_box_PUBLICKEYBYTES = 32; const crypto_box_SECRETKEYBYTES = 32; const crypto_box_BEFORENMBYTES = 32; const crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES; const crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES; const crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES; const crypto_sign_BYTES = 64; const crypto_sign_PUBLICKEYBYTES = 32; const crypto_sign_SECRETKEYBYTES = 32; const crypto_sign_SEEDBYTES = 32; const crypto_hash_BYTES = 64;

    exports.lowlevel = {
      crypto_core_hsalsa20: crypto_core_hsalsa20,
      crypto_stream_xor: crypto_stream_xor,
      crypto_stream: crypto_stream,
      crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
      crypto_stream_salsa20: crypto_stream_salsa20,
      crypto_onetimeauth: crypto_onetimeauth,
      crypto_onetimeauth_verify: crypto_onetimeauth_verify,
      crypto_verify_16: crypto_verify_16,
      crypto_verify_32: crypto_verify_32,
      crypto_secretbox: crypto_secretbox,
      crypto_secretbox_open: crypto_secretbox_open,
      crypto_scalarmult: crypto_scalarmult,
      crypto_scalarmult_base: crypto_scalarmult_base,
      crypto_box_beforenm: crypto_box_beforenm,
      crypto_box_afternm: crypto_box_afternm,
      crypto_box: crypto_box,
      crypto_box_open: crypto_box_open,
      crypto_box_keypair: crypto_box_keypair,
      crypto_hash: crypto_hash,
      crypto_sign: crypto_sign,
      crypto_sign_keypair: crypto_sign_keypair,
      crypto_sign_open: crypto_sign_open,

      crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
      crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
      crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
      crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
      crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
      crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
      crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
      crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
      crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
      crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
      crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
      crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
      crypto_sign_BYTES: crypto_sign_BYTES,
      crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
      crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
      crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
      crypto_hash_BYTES: crypto_hash_BYTES,
    };

    /* High-level API */

    function checkLengths(k, n) {
      if (k.length !== crypto_secretbox_KEYBYTES) {
        throw new Error('bad key size' + n.length + ' expected:' + crypto_secretbox_KEYBYTES);
      }
      if (n.length !== crypto_secretbox_NONCEBYTES) {
        throw new Error('bad nonce size' + n.length + ' expected:' + crypto_secretbox_NONCEBYTES);
      }
    }

    function checkBoxLengths(pk, sk) {
      if (pk.length !== crypto_box_PUBLICKEYBYTES) {
        throw new Error('bad public key size' + pk.length + ' expected:' + crypto_box_PUBLICKEYBYTES);
      }
      if (sk.length !== crypto_box_SECRETKEYBYTES) {
        throw new Error('bad secret key size:' + sk.length + ' expected:' + crypto_box_SECRETKEYBYTES);
      }
    }

    function checkArrayTypes() {
      for (let i = 0; i < arguments.length; i++) {
        if (!(arguments[i] instanceof Uint8Array)) {
          throw new TypeError('unexpected type, use Uint8Array');
        }
      }
    }

    function cleanup(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = 0;
      }
    }

    exports.randomBytes = function(n) {
      const b = new Uint8Array(n);
      randombytes(b, n);
      return b;
    };

    exports.secretbox = function(msg, nonce, key) {
      checkArrayTypes(msg, nonce, key);
      checkLengths(key, nonce);
      const m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
      const c = new Uint8Array(m.length);
      for (let i = 0; i < msg.length; i++) {
        m[i + crypto_secretbox_ZEROBYTES] = msg[i];
      }
      crypto_secretbox(c, m, m.length, nonce, key);
      return c.subarray(crypto_secretbox_BOXZEROBYTES);
    };

    exports.secretbox.open = function(box, nonce, key) {
      checkArrayTypes(box, nonce, key);
      checkLengths(key, nonce);
      const c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
      const m = new Uint8Array(c.length);
      for (let i = 0; i < box.length; i++) {
        c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
      }
      if (c.length < 32) {
        console.log('c.length < 32', c.length);
        return null;
      }
      const val = crypto_secretbox_open(m, c, c.length, nonce, key);
      if (val !== 0) {
        console.log('val !== 0', val);
        return null;
      }
      return m.subarray(crypto_secretbox_ZEROBYTES);
    };

    exports.secretbox.keyLength = crypto_secretbox_KEYBYTES;
    exports.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
    exports.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

    exports.scalarMult = function(n, p) {
      checkArrayTypes(n, p);
      if (n.length !== crypto_scalarmult_SCALARBYTES) {
        throw new Error('bad n size');
      }
      if (p.length !== crypto_scalarmult_BYTES) {
        throw new Error('bad p size');
      }
      const q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult(q, n, p);
      return q;
    };

    exports.scalarMult.base = function(n) {
      checkArrayTypes(n);
      if (n.length !== crypto_scalarmult_SCALARBYTES) {
        throw new Error('bad n size');
      }
      const q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult_base(q, n);
      return q;
    };

    exports.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
    exports.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

    exports.box = function(msg, nonce, publicKey, secretKey) {
      const k = exports.box.before(publicKey, secretKey);
      return exports.secretbox(msg, nonce, k);
    };

    exports.box.before = function(publicKey, secretKey) {
      checkArrayTypes(publicKey, secretKey);
      checkBoxLengths(publicKey, secretKey);
      const k = new Uint8Array(crypto_box_BEFORENMBYTES);
      crypto_box_beforenm(k, publicKey, secretKey);
      return k;
    };

    exports.box.after = exports.secretbox;

    exports.box.open = function(msg, nonce, publicKey, secretKey) {
      const k = exports.box.before(publicKey, secretKey);
      return exports.secretbox.open(msg, nonce, k);
    };

    exports.box.open.after = exports.secretbox.open;

    exports.box.keyPair = function() {
      const pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      const sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
      crypto_box_keypair(pk, sk);
      return {
        publicKey: pk,
        secretKey: sk,
      };
    };

    exports.box.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_box_SECRETKEYBYTES) {
        throw new Error('bad secret key size');
      }
      const pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      crypto_scalarmult_base(pk, secretKey);
      return {
        publicKey: pk,
        secretKey: new Uint8Array(secretKey),
      };
    };

    exports.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
    exports.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
    exports.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
    exports.box.nonceLength = crypto_box_NONCEBYTES;
    exports.box.overheadLength = exports.secretbox.overheadLength;

    exports.sign = function(msg, secretKey) {
      checkArrayTypes(msg, secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES) {
        throw new Error('bad secret key size');
      }
      const signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
      crypto_sign(signedMsg, msg, msg.length, secretKey);
      return signedMsg;
    };

    exports.sign.open = function(signedMsg, publicKey) {
      checkArrayTypes(signedMsg, publicKey);
      if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) {
        throw new Error('bad public key size');
      }
      const tmp = new Uint8Array(signedMsg.length);
      const mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
      if (mlen < 0) {
        return null;
      }
      const m = new Uint8Array(mlen);
      for (let i = 0; i < m.length; i++) {
        m[i] = tmp[i];
      }
      return m;
    };

    exports.sign.detached = function(msg, secretKey) {
      const signedMsg = exports.sign(msg, secretKey);
      const sig = new Uint8Array(crypto_sign_BYTES);
      for (let i = 0; i < sig.length; i++) {
        sig[i] = signedMsg[i];
      }
      return sig;
    };

    exports.sign.detached.verify = function(msg, sig, publicKey) {
      checkArrayTypes(msg, sig, publicKey);
      if (sig.length !== crypto_sign_BYTES) {
        throw new Error('bad signature size');
      }
      if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) {
        throw new Error('bad public key size:' + publicKey.length + ' expected:' + crypto_sign_PUBLICKEYBYTES);
      }
      const sm = new Uint8Array(crypto_sign_BYTES + msg.length);
      const m = new Uint8Array(crypto_sign_BYTES + msg.length);
      let i;
      for (i = 0; i < crypto_sign_BYTES; i++) {
        sm[i] = sig[i];
      }
      for (i = 0; i < msg.length; i++) {
        sm[i + crypto_sign_BYTES] = msg[i];
      }
      return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
    };

    exports.sign.keyPair = function() {
      const pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      const sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      crypto_sign_keypair(pk, sk);
      return {
        publicKey: pk,
        secretKey: sk,
      };
    };

    exports.sign.keyPair.fromUnhashedSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      // if (secretKey.length !== crypto_sign_SECRETKEYBYTES) {
      // throw new Error('bad secret key size');
      // }
      return deriveUnhashedPublicFromSecret(secretKey);
    };

    exports.convertSecretKey = function(sk, direct) {
      let d = new Uint8Array(64);
      const o = new Uint8Array(32);
      let i;
      if (direct) {
        d = sk.slice(0, 32);
      } else {
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
      }
      for (i = 0; i < 32; i++) o[i] = d[i];
      for (i = 0; i < 64; i++) d[i] = 0;
      return o;
    };

    exports.convertPublicKey = function(pk) {
      // https://github.com/dchest/ed2curve-js/blob/master/ed2curve.js
      const z = new Uint8Array(32);
      const q = [gf(), gf(), gf(), gf()];
      const a = gf(); const b = gf();

      if (unpackneg(q, pk)) return null; // reject invalid key

      const y = q[1];

      A(a, gf1, y);
      Z(b, gf1, y);
      inv25519(b, b);
      M(a, a, b);

      pack25519(z, a);
      return z;
    };

    exports.TryToConvertPublicKeyBack = function(pk) {
  		const z = new Uint8Array(32);
  			const x = gf(); const a = gf(); const b = gf();

  		unpack25519(x, pk);

  		A(a, x, gf1);
  		Z(b, x, gf1);
  		inv25519(a, a);
  		M(a, a, b);

  		pack25519(z, a); // what about last byte of this value??? Sometimes pubKeys not equals... Maybe there is parity-bit lost.

      // https://crypto.stackexchange.com/questions/13077/can-curve25519-keys-be-used-with-ed25519-keys

  		return z;
  	};
    exports.convert_ed25519_to_curve25519_public_key = exports.convertPublicKey;

    exports.convert_curve25519_to_ed25519_public_key = exports.TryToConvertPublicKeyBack;



    exports.sign.keyPair.add = function(a, b) {
      const aUnpacked = new Float64Array(80);
      const bUnpacked = new Float64Array(80);
      unpack25519(aUnpacked, a);
      unpack25519(bUnpacked, b);
      add(aUnpacked, bUnpacked);
      pack(bUnpacked, c);
      const c = new Uint8Array(32);
    };

    exports.sign.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES) {
        throw new Error('bad secret key size:' + secretKey.length + ' expected:' + crypto_box_SECRETKEYBYTES);
      }
      let pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      pk = derivePublicFromSecret(secretKey);
      return {
        publicKey: pk,
        secretKey: new Uint8Array(secretKey),
      };
    };

    exports.sign.keyPair.fromSeed = function(seed) {
      checkArrayTypes(seed);
      if (seed.length !== crypto_sign_SEEDBYTES) {
        throw new Error('bad seed size');
      }
      const pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      const sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      for (let i = 0; i < 32; i++) {
        sk[i] = seed[i];
      }
      crypto_sign_keypair(pk, sk, true);
      return {
        publicKey: pk,
        secretKey: sk,
      };
    };

    exports.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
    exports.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
    exports.sign.seedLength = crypto_sign_SEEDBYTES;
    exports.sign.signatureLength = crypto_sign_BYTES;

    exports.hash = function(msg) {
      checkArrayTypes(msg);
      const h = new Uint8Array(crypto_hash_BYTES);
      crypto_hash(h, msg, msg.length);
      return h;
    };

    exports.hash.hashLength = crypto_hash_BYTES;

    exports.verify = function(x, y) {
      checkArrayTypes(x, y);
      // Zero length arguments are considered not equal.
      if (x.length === 0 || y.length === 0) {
        return false;
      }
      if (x.length !== y.length) {
        return false;
      }
      return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
    };

    exports.setPRNG = function(fn) {
      randombytes = fn;
    };

    (function() {
      // Initialize PRNG if environment provides CSPRNG.
      // If not, methods calling randombytes will throw.
      let crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
      if (crypto && crypto.getRandomValues) {
        // Browsers.
        const QUOTA = 65536;
        exports.setPRNG(function(x, n) {
          let i; const v = new Uint8Array(n);
          for (i = 0; i < n; i += QUOTA) {
            crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
          }
          for (i = 0; i < n; i++) {
            x[i] = v[i];
          }
          cleanup(v);
        });
      } else if (typeof require !== 'undefined') {
        // Node.js.
        crypto = require('crypto');
        if (crypto && crypto.randomBytes) {
          exports.setPRNG(function(x, n) {
            let i; const v = crypto.randomBytes(n);
            for (i = 0; i < n; i++) {
              x[i] = v[i];
            }
            cleanup(v);
          });
        }
      }
    })();

    // STARTED BOTTOM nodejs/browser hack
    return exports;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.nacl = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const https = require('https');
  const http = require('http');
  let moduleRef;

  let url;

  let logRequestErrors = true;

  const LOG_GET_GENERATED_WORK = false;

  const sendRequest = async (formData) => {
    /* istanbul ignore if */
    if (formData == undefined) {
      throw Error(`'formData' is a required parameter.`);
    }
    return new Promise((resolve, reject) => {
    // https://docs.nano.org/commands/rpc-protocol#accounts-balances

      const apiUrl = new URL(url);
      // console.log('apiUrl', apiUrl);
      const body = JSON.stringify(formData);
      //        console.log( 'sendRequest request', body );

      const options = {
        method: 'POST',
        hostname: apiUrl.hostname,
        path: apiUrl.pathname,
        port: apiUrl.port,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
        },
        timeout: 30000,
      };
      // console.log('url', url);
      // console.log('apiUrl.protocol', apiUrl.protocol);
      const req = moduleRef.request(options, (res) => {
      // console.log(`statusCode: ${res.statusCode}`);
        let chunks = '';
        res.on('data', (chunk) => {
          chunks += chunk;
        });

        res.on('end', () => {
          if (chunks.length == 0) {
            resolve(undefined);
          } else {
            try {
              const json = JSON.parse(chunks);
              resolve(json);
            } catch (error) {
              reject(error);
            }
          }
        });
      });

      req.on('error', (error) => {
        /* istanbul ignore if */
        if (logRequestErrors) {
          console.log('sendRequest error', error, body);
        }
        reject(Error(error));
      });

      req.write(body);
      req.end();
    });
  };

  const getAccountBalanceRaw = async (account) => {
    const balances = await getAccountBalanceAndPendingRaw(account);
    if (balances) {
      return balances.balance;
    }
  };

  const getAccountBalanceAndPendingRaw = async (account) => {
    /* istanbul ignore if */
    if (account == undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    const formData = {
      action: 'accounts_balances',
      accounts: [account],
    };
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `accounts_balances error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            if (json == undefined) {
              resolve();
              return;
            }
            // console.log( 'accounts_balances json', json );
            if (json.balances == undefined) {
              resolve();
              return;
            }
            // console.log( 'accounts_balances json.balances', json.balances );
            resolve({
              balance: json.balances[account].balance,
              pending: json.balances[account].pending,
            });
          });
    });
  };

  const getAccountRepresentative = async (account) => {
    /* istanbul ignore if */
    if (account == undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    // https://docs.nano.org/commands/rpc-protocol#account-representative
    const formData = {
      action: 'account_representative',
      account: account,
    };
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `account_representative error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            if (json === undefined) {
              resolve('');
            } else {
              const representative = json.representative;
              resolve(representative);
            }
          });
    });
  };

  const getPrevious = async (account) => {
    /* istanbul ignore if */
    if (account == undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    // https://docs.nano.org/commands/rpc-protocol#frontiers
    const formData = {
      action: 'accounts_frontiers',
      accounts: [account],
      count: 1,
    };
    // console.log( `accounts_frontiers request ${account}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `accounts_frontiers error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `accounts_frontiers response ${JSON.stringify( json )}` );
            if (json === undefined) {
              resolve('');
            } else if (json.frontiers == undefined) {
              // console.log( `accounts_frontiers response ${account}` );
              resolve('');
            } else if (json.frontiers == '') {
              // console.log( `accounts_frontiers response ${account}` );
              resolve('');
            } else {
              const previous = json.frontiers[account];
              // console.log( `accounts_frontiers response ${account} ${previous}` );
              resolve(previous);
            }
          });
    });
  };


  const getAccountHistory = async (account, count, head, raw) => {
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    /* istanbul ignore if */
    if (count === undefined) {
      throw Error(`'count' is a required parameter.`);
    }
    // https://docs.nano.org/commands/rpc-protocol/#account_history
    const formData = {
      action: 'account_history',
      account: account,
      count: count,
    };

    if (head !== undefined) {
      formData.head = head;
    }

    if (raw !== undefined) {
      formData.raw = raw;
    }

    // console.log( `account_history request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `account_history error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `account_history response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getAccountInfo = async (account, representativeFlag) => {
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error(`'account' is a required parameter.`);
    }
    // https://docs.nano.org/commands/rpc-protocol/#account_info
    const formData = {
      action: 'account_info',
      account: account,
    };

    if (representativeFlag !== undefined) {
      if (representativeFlag) {
        formData.representative = 'true';
      } else {
        formData.representative = 'false';
      }
    }

    // console.log( `account_info request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `account_info error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `account_info response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getBlocks = async (hashes, jsonBlock) => {
    /* istanbul ignore if */
    if (hashes === undefined) {
      throw Error(`'hashes' is a required parameter.`);
    }
    // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#retrieve-multiple-blocks
    const formData = {
      action: 'blocks',
      hashes: hashes,
    };

    if (jsonBlock !== undefined) {
      formData.json_block = jsonBlock;
    }

    // console.log( `blocks request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `blocks error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `blocks response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const process = async (block, subtype) => {
    /* istanbul ignore if */
    if (block == undefined) {
      throw Error(`'block' is a required parameter.'`);
    }
    /* istanbul ignore if */
    if (subtype == undefined) {
      throw Error(`'subtype' is a required parameter.'`);
    }

    // https://docs.nano.org/commands/rpc-protocol/#process
    const formData = {
      'action': 'process',
      'json_block': 'true',
      'subtype': subtype,
      'block': block,
    };
    // console.log( `process block`, block, block.work );
    if (block.work === undefined) {
      formData.do_work = true;
    }
    // console.log( `process request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `process error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `process response ${JSON.stringify( json )}` );
            if (json === undefined) {
              resolve('');
            } else {
              if (json.hash === undefined) {
                // console.log(`process hash undefined`);
                if (json.error === undefined) {
                  // console.log(`process error undefined`);
                  const jsonStr = JSON.stringify( json );
                  // console.log(`process reject ${jsonStr}`);
                  reject(Error(jsonStr));
                } else {
                  reject(Error(json.error));
                }
              } else {
                const hash = json.hash;
                resolve(hash);
              }
            }
          });
    });
  };

  const getGeneratedWork = async (hash) => {
  // https://docs.nano.org/commands/rpc-protocol#work-generate
    const formData = {
      action: 'work_generate',
      hash: hash,
    };

    /* istanbul ignore if */
    if (LOG_GET_GENERATED_WORK) {
      console.log(`STARTED getGeneratedWork request ${JSON.stringify( formData )}`);
    }

    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `getGeneratedWork error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            if (json === undefined) {
              resolve('');
            } else {
              /* istanbul ignore if */
              if (LOG_GET_GENERATED_WORK) {
                console.log(`SUCCESS getGeneratedWork response ${JSON.stringify( json )}`);
              }
              const work = json.work;
              resolve(work);
            }
          });
    });
  };

  const getAccountsPending = async (accounts, count, source) => {
    /* istanbul ignore if */
    if (accounts === undefined) {
      throw Error('accounts is a required parameter.');
    }
    /* istanbul ignore if */
    if (count === undefined) {
      throw Error('count is a required parameter.');
    }
    // https://docs.nano.org/commands/rpc-protocol/#accounts_pending
    const formData = {
      action: 'accounts_pending',
      accounts: accounts,
      count: count,
      threshold: 1,
    };

    if (source !== undefined) {
      if (source) {
        formData.source = 'true';
      } else {
        formData.source = 'false';
      }
    }
    // console.log( `accounts_pending request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `accounts_pending error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `accounts_pending response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getBlockAccount = async (hash) => {
    /* istanbul ignore if */
    if (hash === undefined) {
      throw Error('hash is a required parameter.');
    }
    // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#block-account
    const formData = {
      action: 'block_account',
      hash: hash,
    };
    // console.log( `block_account request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `block_account error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `block_account response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getFrontiers = async (account, count) => {
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error('account is a required parameter.');
    }
    /* istanbul ignore if */
    if (count === undefined) {
      throw Error('count is a required parameter.');
    }
    // https://github.com/nanocurrency/nano-node/wiki/RPC-protocol#frontiers
    const formData = {
      action: 'frontiers',
      account: account,
      count: count,
    };
    // console.log( `frontiers request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `frontiers error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `frontiers response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const getBlockCount = async () => {
  // https://docs.nano.org/commands/rpc-protocol/#block_count
    const formData = {
      action: 'block_count',
    };
    // console.log( `block_count request ${JSON.stringify( formData )}` );
    return new Promise((resolve, reject) => {
      sendRequest(formData)
          .catch((error) => {
            // console.log( `block_count error '${error.message}'` );
            reject(error);
          })
          .then((json) => {
            // console.log( `block_count response ${JSON.stringify( json )}` );
            resolve(json);
          });
    });
  };

  const setUrl = (newUrl) => {
    // console.log('started serUrl', newUrl);
    url = newUrl;
    if (url !== undefined) {
      if (url.startsWith('https')) {
        moduleRef = https;
      } else if (url.startsWith('http')) {
        moduleRef = http;
      }
    }
    // console.log('success serUrl', newUrl, url);
  };

  const setModuleRef = (newModuleRef) => {
    moduleRef = newModuleRef;
  };

  const setLogRequestErrors = (newLogRequestErrors) => {
    logRequestErrors = newLogRequestErrors;
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.setUrl = setUrl;
    exports.setModuleRef = setModuleRef;
    exports.setLogRequestErrors = setLogRequestErrors;
    exports.getFrontiers = getFrontiers;
    exports.getBlockAccount = getBlockAccount;
    exports.getAccountsPending = getAccountsPending;
    exports.getAccountBalanceRaw = getAccountBalanceRaw;
    exports.getAccountBalanceAndPendingRaw = getAccountBalanceAndPendingRaw;
    exports.getAccountRepresentative = getAccountRepresentative;
    exports.getPrevious = getPrevious;
    exports.process = process;
    exports.getGeneratedWork = getGeneratedWork;
    exports.getAccountHistory = getAccountHistory;
    exports.getAccountInfo = getAccountInfo;
    exports.getBlocks = getBlocks;
    exports.getBlockCount = getBlockCount;
    exports.sendRequest = sendRequest;
    exports.log = console.log;
    exports.trace = console.trace;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.bananodeApi = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.log = console.log;
    exports.trace = console.trace;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.loggingUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const sleep = ( millis ) => {
    return new Promise( (resolve) => setTimeout( resolve, millis ) );
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.sleep = sleep;
    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.sleepUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';

// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
// istanbul ignore if
  if (typeof BigInt === 'undefined') {
    return;
  }
  const blake = require('../../libraries/blake2b/blake2b.js');

  const nacl = require('../../libraries/tweetnacl/nacl.js');

  const workMin = BigInt('0xfffffe0000000000');

  const preamble = '0000000000000000000000000000000000000000000000000000000000000006';

  const prefixDivisors = {
    'ban_': {
      minorDivisor: BigInt('1000000000000000000000000000'),
      majorDivisor: BigInt('100000000000000000000000000000'),
      majorName: 'banano',
      minorName: 'banoshi',
    },
    'nano_': {
      minorDivisor: BigInt('1000000000000000000000000'),
      majorDivisor: BigInt('1000000000000000000000000000000'),
      majorName: 'nano',
      minorName: 'nanoshi',
    },
  };

  const ACCOUNT_ALPHABET_REGEX_STR = '^[13456789abcdefghijkmnopqrstuwxyz]+$';

  const SEED_ALPHABET_REGEX_STR = '^[0123456789abcdefABCDEF]{64}$';

  const LOG_SEND = false;

  const LOG_SEND_PROCESS = false;

  const LOG_RECEIVE = false;

  const LOG_OPEN = false;

  const LOG_CHANGE = false;

  const LOG_IS_WORK_VALID = false;

  const LOG_GET_HASH_CPU_WORKER = false;

  /**
 * Converts an amount into a raw amount.
 *
 * @memberof BananoUtil
 * @param {string} amountStr the amount, as a string.
 * @param {string} amountPrefix the amount, as a string.
 * @return {string} the banano as a raw value.
 */
  const getRawStrFromMajorAmountStr = (amountStr, amountPrefix) => {
  /* istanbul ignore if */
    if (amountStr == undefined) {
      throw Error( 'amountStr is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    /* istanbul ignore if */
    if (typeof amountStr !== 'string') {
      throw Error(`'${amountStr}' is not a string.`);
    }
    const decimalPlace = amountStr.indexOf('.');
    let divisor = BigInt('1');
    // console.log('STARTED getRawStrFromAmountStr', bananoStr, decimalPlace, divisor);
    if (decimalPlace !== -1) {
      amountStr = amountStr.replace('.', '');
      const decimalsAfter = amountStr.length - decimalPlace;
      // console.log('INTERIM getRawStrFromAmountStr decimalsAfter', decimalsAfter);
      divisor = BigInt('10') ** BigInt(decimalsAfter);
    }
    // console.log('INTERIM getRawStrFromAmountStr', bananoStr, decimalPlace, divisor);
    const amountBi = BigInt(amountStr);
    // console.log('INTERIM getRawStrFromAmountStr banano   ', banano);
    // console.log('INTERIM getRawStrFromAmountStr bananoDiv', majorDivisor);

    /* istanbul ignore if */
    if (prefixDivisors[amountPrefix] == undefined) {
      throw Error(`'${amountPrefix}' is not an amountPrefix. (${[...Object.keys(prefixDivisors)]})`);
    }
    const majorDivisor = prefixDivisors[amountPrefix].majorDivisor;

    const amountRaw = (amountBi * majorDivisor) / divisor;
    // console.log('INTERIM getRawStrFromAmountStr bananoRaw', bananoRaw);
    // const parts = getAmountPartsFromRaw(bananoRaw.toString());
    // console.log('SUCCESS getRawStrFromAmountStr', bananoStr, bananoRaw, parts);
    return amountRaw.toString();
  };

  /**
 * Converts a banoshi amount into a raw amount.
 *
 * @memberof BananoUtil
 * @param {string} amountStr the banoshi, as a string.
 * @param {string} amountPrefix the amount prefix, as a string.
 * @return {string} the banano as a raw value.
 */
  const getRawStrFromMinorAmountStr = (amountStr, amountPrefix) => {
  /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const amount = BigInt(amountStr);
    const prefixDivisor = prefixDivisors[amountPrefix];
    const minorDivisor = prefixDivisor.minorDivisor;
    const amountRaw = amount * minorDivisor;
    return amountRaw.toString();
  };

  /**
 * @typedef {Object} BananoParts
 * @property {string} banano - The amount of banano.
 * @property {string} banoshi - The amount of banoshi (not counting whole banano).
 * @property {string} raw - The amount of raw (not counting whole banano and whole banoshi).
 */

  /**
   * Get the banano parts (banano, banoshi, raw) for a given raw value.
   *
   * @memberof BananoUtil
   * @param {string} amountRawStr the raw amount, as a string.
   * @param {string} amountPrefix the amount prefix, as a string.
   * @return {BananoParts} the banano parts.
   */
  const getAmountPartsFromRaw = (amountRawStr, amountPrefix) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const amountRaw = BigInt(amountRawStr);
    //    console.log(`bananoRaw:    ${bananoRaw}`);
    const prefixDivisor = prefixDivisors[amountPrefix];
    const majorDivisor = prefixDivisor.majorDivisor;
    const minorDivisor = prefixDivisor.minorDivisor;
    //    console.log(`bananoDivisor:   ${bananoDivisor}`);
    const major = amountRaw / majorDivisor;
    //    console.log(`banano:${banano}`);
    const majorRawRemainder = amountRaw - (major * majorDivisor);
    const minor = majorRawRemainder / minorDivisor;
    const amountRawRemainder = majorRawRemainder - (minor * minorDivisor);

    const bananoParts = {};
    bananoParts.majorName = prefixDivisor.majorName;
    bananoParts.minorName = prefixDivisor.minorName;
    bananoParts[prefixDivisor.majorName] = major.toString();
    bananoParts[prefixDivisor.minorName] = minor.toString();
    bananoParts.raw = amountRawRemainder.toString();
    return bananoParts;
  };

  const hexToBytes = (hex) => {
    const ret = new Uint8Array(hex.length / 2);
    for (let i = 0; i < ret.length; i++) {
      ret[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return ret;
  };

  const bytesToHex = (bytes) => {
    return Array.prototype.map.call(bytes, (x) => ('00' + x.toString(16)).slice(-2)).join('').toUpperCase();
  };

  const hash = (block) => {
  /* istanbul ignore if */
    if (block === undefined) {
      throw Error('block is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.account === undefined) {
      throw Error('block.account is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.previous === undefined) {
      throw Error('block.previous is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.representative === undefined) {
      throw Error('block.representative is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.balance === undefined) {
      throw Error('block.balance is a required parameter.');
    }
    /* istanbul ignore if */
    if (block.link === undefined) {
      throw Error('block.link is a required parameter.');
    }
    const context = blake.blake2bInit(32, null);
    blake.blake2bUpdate(context, hexToBytes(preamble));
    blake.blake2bUpdate(context, hexToBytes(getAccountPublicKey(block.account)));
    blake.blake2bUpdate(context, hexToBytes(block.previous));
    blake.blake2bUpdate(context, hexToBytes(getAccountPublicKey(block.representative)));

    // console.log( `block.balance:${block.balance}` );
    let balanceToPad = BigInt(block.balance).toString(16);
    // console.log( `pre  balanceToPad:${balanceToPad}` );
    while (balanceToPad.length < 32) {
      balanceToPad = '0' + balanceToPad;
    }
    // console.log( `post balanceToPad:${balanceToPad}` );
    const balance = hexToBytes(balanceToPad);
    // console.log( `balance:${balance}` );
    blake.blake2bUpdate(context, balance);
    blake.blake2bUpdate(context, hexToBytes(block.link));
    const hash = bytesToHex(blake.blake2bFinal(context));
    return hash;
  };

  const uint5ToUint4 = (uint5) => {
    const length = uint5.length / 4 * 5;
    const uint4 = new Uint8Array(length);
    for (let i = 1; i <= length; i++) {
      const n = i - 1;
      const m = i % 5;
      const z = n - ((i - m) / 5);
      const right = uint5[z - 1] << (5 - m);
      const left = uint5[z] >> m;
      uint4[n] = (left + right) % 16;
    }
    return uint4;
  };

  const arrayCrop = (array) => {
    const length = array.length - 1;
    const croppedArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      croppedArray[i] = array[i + 1];
    }
    return croppedArray;
  };

  const uint4ToHex = (uint4) => {
    let hex = '';
    for (let i = 0; i < uint4.length; i++) {
      hex += uint4[i].toString(16).toUpperCase();
    }
    return hex;
  };

  const uint8ToUint4 = (uintValue) => {
    const uint4 = new Uint8Array(uintValue.length * 2);
    for (let i = 0; i < uintValue.length; i++) {
      uint4[i * 2] = uintValue[i] / 16 | 0;
      uint4[i * 2 + 1] = uintValue[i] % 16;
    }

    return uint4;
  };

  const equalArrays = (array1, array2) => {
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] != array2[i]) return false;
    }
    return true;
  };

  const uint4ToUint8 = (uintValue) => {
    const length = uintValue.length / 2;
    const uint8 = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8[i] = (uintValue[i * 2] * 16) + uintValue[i * 2 + 1];
    }

    return uint8;
  };

  const stringToUint5 = (string) => {
    const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
    const length = string.length;
    const stringArray = string.split('');
    const uint5 = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint5[i] = letterList.indexOf(stringArray[i]);
    }
    return uint5;
  };

  const isAccountSuffixValid = (accountSuffix) => {
    const regex = new RegExp(ACCOUNT_ALPHABET_REGEX_STR);
    const isValid = regex.test(accountSuffix);
    const retval = {};
    retval.valid = isValid;
    if (isValid) {
      retval.message = '';
    } else {
      retval.message = `does not match regex '${ACCOUNT_ALPHABET_REGEX_STR}'`;
    }
    return retval;
  };

  /**
 * Get the public key for a given account.
 *
 * @memberof BananoUtil
 * @param {string} account the account.
 * @return {string} the public key.
 */
  const getAccountPublicKey = (account) => {
    if (account === undefined) {
      throw Error(`Undefined BANANO Account`);
    }
    if (account.startsWith === undefined) {
      throw Error(`Not a string: '${account}'`);
    }
    let accountCrop;
    if (account.startsWith('camo')) {
      if (((!account.startsWith('camo_1')) &&
        (!account.startsWith('camo_3'))) ||
        (account.length !== 65)) {
        throw Error(`Invalid CAMO BANANO Account prefix '${account}'`);
      }
      accountCrop = account.substring(5, 65);
    } else if (account.startsWith('nano')) {
      if (((!account.startsWith('nano_1')) &&
        (!account.startsWith('nano_3'))) ||
        (account.length !== 65)) {
        throw Error(`Invalid NANO Account prefix '${account}'`);
      }
      accountCrop = account.substring(5, 65);
    } else {
      if (((!account.startsWith('ban_1')) &&
        (!account.startsWith('ban_3'))) ||
        (account.length !== 64)) {
        throw Error(`Invalid BANANO Account prefix '${account}'`);
      }
      accountCrop = account.substring(4, 64);
    }
    const isAccountValid = isAccountSuffixValid(accountCrop);
    if (!isAccountValid.valid) {
      throw Error(`Invalid BANANO Account '${account}', ${isAccountValid.message}`);
    }

    const keyUint4 = arrayCrop(uint5ToUint4(stringToUint5(accountCrop.substring(0, 52))));
    const hashUint4 = uint5ToUint4(stringToUint5(accountCrop.substring(52, 60)));
    const keyArray = uint4ToUint8(keyUint4);
    const blakeHash = blake.blake2b(keyArray, null, 5).reverse();

    const left = hashUint4;
    const right = uint8ToUint4(blakeHash);
    if (!equalArrays(left, right)) {
      const leftStr = uint5ToString(uint4ToUint5(left));
      const rightStr = uint5ToString(uint4ToUint5(right));

      throw Error(`Incorrect checksum ${leftStr} <> ${rightStr}`);
    }

    return uint4ToHex(keyUint4);
  };

  const hexToUint8 = (hexValue) => {
    const length = (hexValue.length / 2) | 0;
    const uint8 = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);
    }
    return uint8;
  };

  const decToHex = (decValue, bytes = null) => {
    const dec = decValue.toString().split('');
    const sum = [];
    let hex = '';
    const hexArray = [];
    let i; let s;
    while (dec.length) {
      s = 1 * dec.shift();
      for (i = 0; s || i < sum.length; i++) {
        s += (sum[i] || 0) * 10;
        sum[i] = s % 16;
        s = (s - sum[i]) / 16;
      }
    }
    while (sum.length) {
      hexArray.push(sum.pop().toString(16));
    }

    hex = hexArray.join('');

    if (hex.length % 2 != 0) {
      hex = '0' + hex;
    }

    if (bytes > hex.length / 2) {
      const diff = bytes - hex.length / 2;
      for (let j = 0; j < diff; j++) {
        hex = '00' + hex;
      }
    }

    return hex;
  };


  const generateAccountSecretKeyBytes = (seedBytes, accountIndex) => {
    const accountBytes = hexToUint8(decToHex(accountIndex, 4));
    const context = blake.blake2bInit(32);
    blake.blake2bUpdate(context, seedBytes);
    blake.blake2bUpdate(context, accountBytes);
    const newKey = blake.blake2bFinal(context);
    return newKey;
  };

  const uint4ToUint5 = (uintValue) => {
    const length = uintValue.length / 5 * 4;
    const uint5 = new Uint8Array(length);
    for (let i = 1; i <= length; i++) {
      const n = i - 1;
      const m = i % 4;
      const z = n + ((i - m) / 4);
      const right = uintValue[z] << m;
      let left;
      if (((length - i) % 4) == 0) {
        left = uintValue[z - 1] << 4;
      } else {
        left = uintValue[z + 1] >> (4 - m);
      }
      uint5[n] = (left + right) % 32;
    }
    return uint5;
  };


  /**
   * Get the account suffix for a given public key (everything but ban_ or camo_ or nano_).
   *
   * @memberof BananoUtil
   * @param {string} publicKey the public key.
   * @return {string} the account suffix.
   */
  const getAccountSuffix = (publicKey) => {
    const keyBytes = uint4ToUint8(hexToUint4(publicKey)); // For some reason here we go from u, to hex, to 4, to 8??
    const checksum = uint5ToString(uint4ToUint5(uint8ToUint4(blake.blake2b(keyBytes, null, 5).reverse())));
    const account = uint5ToString(uint4ToUint5(hexToUint4(`0${publicKey}`)));
    return `${account}${checksum}`;
  };

  /**
   * Get the account for a given public key.
   *
   * @memberof BananoUtil
   * @param {string} publicKey the public key.
   * @param {string} accountPrefix the prefix. ban_ or nano_.
   * @return {string} the account.
   */
  const getAccount = (publicKey, accountPrefix) => {
    /* istanbul ignore if */
    if (accountPrefix == undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    const accountSuffix = getAccountSuffix(publicKey);
    return `${accountPrefix}${accountSuffix}`;
  };

  const uint5ToString = (uint5) => {
    const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
    let string = '';
    for (let i = 0; i < uint5.length; i++) {
      string += letterList[uint5[i]];
    }

    return string;
  };

  const hexToUint4 = (hexValue) => {
    const uint4 = new Uint8Array(hexValue.length);
    for (let i = 0; i < hexValue.length; i++) {
      uint4[i] = parseInt(hexValue.substr(i, 1), 16);
    }

    return uint4;
  };

  const signHash = (privateKey, hash) => {
  //    console.log( `sign ${JSON.stringify( block )}` );
    const hashBytes = hexToBytes(hash);
    //    console.log( `hashBytes[${hashBytes.length}]:${hashBytes}` );

    const privateKeyBytes = hexToBytes(privateKey);
    //    console.log( `privateKeyBytes[${privateKeyBytes.length}]:${privateKeyBytes}` );

    const signed = nacl.sign.detached(hashBytes, privateKeyBytes);
    const signature = bytesToHex(signed);
    return signature;
  };

  const verify = (hash, signature, publicKey) => {
    const hashBytes = hexToBytes(hash);
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);
    return nacl.sign.detached.verify(hashBytes, signatureBytes, publicKeyBytes);
  };

  const sign = async (privateKey, block) => {
    if (typeof privateKey == 'object') {
      const hwResponse = await privateKey.signBlock(block);
      return hwResponse.signature;
    } else {
      return signHash(privateKey, hash(block));
    }
  };

  const generateAccountKeyPair = (accountSecretKeyBytes) => {
    return nacl.sign.keyPair.fromSecretKey(accountSecretKeyBytes);
  };

  /**
 * returns true if the work (in bytes) for the hash (in bytes) is valid.
 *
 * @memberof BananoUtil
 * @param {string} hashBytes the hash bytes to check.
 * @param {string} workBytes the work bytes to check.
 * @return {boolean} true if the work is valid for the hash.
 */
  const isWorkValid = (hashBytes, workBytes) => {
    const context = blake.blake2bInit(8);
    blake.blake2bUpdate(context, workBytes);
    blake.blake2bUpdate(context, hashBytes);
    const output = blake.blake2bFinal(context).reverse();
    const outputHex = bytesToHex(output);
    const outputBigInt = BigInt('0x' + outputHex);

    const retval = outputBigInt >= workMin;

    /* istanbul ignore if */
    if (LOG_IS_WORK_VALID) {
      console.log(`isWorkValid ${outputBigInt} >= ${workMin} ? ${retval}`);
    }

    return retval;
  };

  const incrementBytes = (bytes) => {
    let x = bytes.length - 1;
    for (x; x >= 0; x--) {
      if ( bytes[x] ^ 0xFF ) {
        bytes[x]++;
        return;
      } else {
        bytes[x] = 0;
      }
    }
  };

  /**
   * creates a new Uint8Array(8) to calculate work bytes.
   *
   * @memberof BananoUtil
   * @return {Uint8Array} the bytes in a Uint8Array.
   */
  const getZeroedWorkBytes = () => {
    return new Uint8Array(8);
  };

  const getHashCPUWorker = (hash, workBytes) => {
  /* istanbul ignore if */
    if (LOG_GET_HASH_CPU_WORKER) {
      console.log('STARTED getHashCPUWorker', hash, bytesToHex(startWorkBytes));
    }
    /* istanbul ignore if */
    if (hash === undefined) {
      throw Error('hash is a required parameter.');
    }
    /* istanbul ignore if */
    if (workBytes === undefined) {
      throw Error('workBytes is a required parameter.');
    }
    const hashBytes = hexToBytes(hash);

    // const startTime = process.hrtime.bigint();
    let isWorkValidFlag = isWorkValid(hashBytes, workBytes);

    // let isWorkValidNanos = process.hrtime.bigint() - startTime;
    // let incrementBytesNanos = BigInt(0);

    while (!isWorkValidFlag) {
      // const startTime0 = process.hrtime.bigint();
      incrementBytes(workBytes);
      // incrementBytesNanos += process.hrtime.bigint() - startTime0;

      // const startTime1 = process.hrtime.bigint();
      isWorkValidFlag = isWorkValid(hashBytes, workBytes);
      // isWorkValidNanos += process.hrtime.bigint() - startTime1;
    }
    const retval = bytesToHex(workBytes.reverse());
    /* istanbul ignore if */
    if (LOG_GET_HASH_CPU_WORKER) {
      console.log('SUCCESS getHashCPUWorker', hash, bytesToHex(startWorkBytes), retval);
    }
    return retval;
  };


  /**
 * Get the public key for a given private key.
 *
 * @memberof BananoUtil
 * @param {string} privateKey the private key.
 * @return {string} the public key.
 */
  const getPublicKey = async (privateKey) => {
    if (typeof privateKey == 'object') {
      return await privateKey.getPublicKey();
    }
    const accountKeyPair = generateAccountKeyPair(hexToBytes(privateKey));
    return bytesToHex(accountKeyPair.publicKey);
  };

  /**
 * validates a seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to validate.
 * @param {string} seedIx the index to use with the seed.
 * @return {object} {valid:[true/false] message:[if false, why]}.
 */
  const isSeedValid = (seed) => {
    const regex = new RegExp(SEED_ALPHABET_REGEX_STR);
    const isValid = regex.test(seed);
    const retval = {};
    retval.valid = isValid;
    if (isValid) {
      retval.message = '';
    } else {
      retval.message = `does not match regex '${SEED_ALPHABET_REGEX_STR}'`;
    }
    return retval;
  };

  /**
 * Get the private key for a given seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @return {string} the private key.
 */
  const getPrivateKey = (seed, seedIx) => {
  /* istanbul ignore if */
    if (seed === undefined) {
      throw Error('seed is a required parameter.');
    }
    /* istanbul ignore if */
    if (seedIx === undefined) {
      throw Error('seedIx is a required parameter.');
    }
    const isValid = isSeedValid(seed);
    if (!isValid.valid) {
      throw Error(`Invalid BANANO seed '${seed}', ${isValid.message}`);
    }
    const seedBytes = hexToBytes(seed);
    const accountBytes = generateAccountSecretKeyBytes(seedBytes, seedIx);
    return bytesToHex(accountBytes);
  };

  const send = async (bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback, accountPrefix) => {
  /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (seed === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (seedIx === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (successCallback === undefined) {
      throw Error('successCallback is a required parameter.');
    }
    /* istanbul ignore if */
    if (failureCallback === undefined) {
      throw Error('failureCallback is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED send ${seed} ${seedIx}`);
    }
    const privateKey = getPrivateKey(seed, seedIx);
    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`INTERIM send ${seed} ${seedIx} ${privateKey}`);
    }
    await sendFromPrivateKey(bananodeApi, privateKey, destAccount, amountRaw, accountPrefix)
        .then((hash) => {
          /* istanbul ignore if */
          if (LOG_SEND) {
            console.log(`SUCCESS send ${seed} ${seedIx} ${hash}`);
          }
          successCallback(hash);
        })
        .catch((error) => {
          /* istanbul ignore if */
          if (LOG_SEND) {
            console.log('FAILURE send', error);
          }
          failureCallback(error);
        });
  };

  const sendFromPrivateKey = async (bananodeApi, privateKey, destAccount, amountRaw, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    return await sendFromPrivateKeyWithRepresentative(bananodeApi, privateKey, destAccount, amountRaw, undefined, accountPrefix);
  };

  const sendFromPrivateKeyWithRepresentative = async (bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    return await sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, undefined, accountPrefix);
  };

  const sendFromPrivateKeyWithRepresentativeAndPrevious = async (bananodeApi, privateKey, destAccount, amountRaw, newRepresentative, newPrevious, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (destAccount === undefined) {
      throw Error('destAccount is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is a required parameter.');
    }
    // newRepresentative is optional.
    // newPrevious is optional.

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED sendFromPrivateKeyWithRepresentativeAndPrevious ${destAccount} ${amountRaw}`);
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED getPublicKey ${privateKey}`);
    }
    const publicKey = await getPublicKey(privateKey);

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED getPublicAccountID ${publicKey}`);
    }
    const accountAddress = getAccount(publicKey, accountPrefix);

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`STARTED getAccountInfo ${destAccount} ${amountRaw}`);
    }

    const accountInfo = await bananodeApi.getAccountInfo(accountAddress);
    if (accountInfo == undefined) {
      throw Error(`The server's account info cannot be retrieved, please try again.`);
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`SUCCESS getAccountInfo ${accountAddress} ${JSON.stringify(accountInfo)}`);
    }

    const balanceRaw = accountInfo.balance;

    if (balanceRaw == undefined) {
      throw Error(`The server's account balance cannot be retrieved, please try again.`);
    }

    if (BigInt(balanceRaw) < BigInt(amountRaw)) {
      const balance = getAmountPartsFromRaw(balanceRaw, accountPrefix);
      const amount = getAmountPartsFromRaw(amountRaw, accountPrefix);
      const balanceMajorAmount = balance[balance.majorName];
      const amountMajorAmount = amount[amount.majorName];
      //        console.log( `balance:${JSON.stringify( balance )}` );
      throw Error(`The server's account balance of ${balanceMajorAmount} ${balance.majorName}s is too small, cannot withdraw ${amountMajorAmount} ${balance.majorName}s. In raw ${balanceRaw} < ${amountRaw}.`);
    }

    const remaining = BigInt(balanceRaw) - BigInt(amountRaw);


    const remainingDecimal = remaining.toString(10);
    let remainingPadded = remaining.toString(16);
    // Left pad with 0's
    while (remainingPadded.length < 32) {
      remainingPadded = '0' + remainingPadded;
    }

    let representative;
    if (newRepresentative !== undefined) {
      representative = newRepresentative;
    } else {
      representative = await bananodeApi.getAccountRepresentative(accountAddress);
    }


    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`INTERIM send representative ${representative}`);
    }

    let previous;
    if (newPrevious !== undefined) {
      previous = newPrevious;
    } else {
      previous = accountInfo.frontier;
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log(`INTERIM send previous ${previous}`);
    }

    if (previous == '') {
    /* istanbul ignore if */
      if (LOG_SEND) {
        console.log(`FAILURE previous == ''`);
      }
      return undefined;
    } else {
      // const hashBytes = hexToBytes(previous);

      const block = {};
      block.type = 'state';
      block.account = accountAddress;
      block.previous = previous;
      block.representative = representative;
      block.balance = remainingDecimal;
      const work = await bananodeApi.getGeneratedWork(previous);
      block.work = work;
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('STARTED getAccountPublicKey', destAccount);
      }
      block.link = getAccountPublicKey(destAccount);
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('SUCCESS getAccountPublicKey', destAccount);
      }
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('STARTED sign');
      }
      block.signature = await sign(privateKey, block);
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('SUCCESS sign');
      }

      /* istanbul ignore if */
      if (LOG_SEND || LOG_SEND_PROCESS) {
        console.log(`STARTED process`, block);
      }
      const processResponse = await bananodeApi.process(block, 'send');
      /* istanbul ignore if */
      if (LOG_SEND || LOG_SEND_PROCESS) {
        console.log(`SUCCESS process`, processResponse);
      }
      return processResponse;
    }
  };

  const open = async (bananodeApi, privateKey, publicKey, representative, pending, pendingValueRaw, accountPrefix) => {
    const work = await bananodeApi.getGeneratedWork(publicKey);
    const accountAddress = getAccount(publicKey, accountPrefix);
    const block = {};
    block.type = 'state';
    block.account = accountAddress;
    block.previous = '0000000000000000000000000000000000000000000000000000000000000000';
    block.representative = representative;
    block.balance = pendingValueRaw;
    block.link = pending;
    block.work = work;
    block.signature = await sign(privateKey, block);

    // console.log( 'open', block );

    try {
      const processResponse = await bananodeApi.process(block, 'open');
      /* istanbul ignore if */
      if (LOG_OPEN) {
        console.log('SUCCESS open', processResponse);
      }
      return processResponse;
    } catch (e) {
    /* istanbul ignore if */
      if (LOG_OPEN) {
        console.log('FAILURE open', JSON.stringify(e));
      }
      throw Error(e.message);
    }
  };

  const change = async (bananodeApi, privateKey, representative, accountPrefix) => {
  /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (representative === undefined) {
      throw Error('representative is a required parameter.');
    }
    const publicKey = await getPublicKey(privateKey);
    const accountAddress = getAccount(publicKey, accountPrefix);
    const accountInfo = await bananodeApi.getAccountInfo(accountAddress);
    /* istanbul ignore if */
    if (accountInfo == undefined) {
      throw Error(`The server's account info cannot be retrieved, please try again.`);
    }
    const previous = accountInfo.frontier;
    const work = await bananodeApi.getGeneratedWork(previous);
    const balanceRaw = accountInfo.balance;


    /* istanbul ignore if */
    if (balanceRaw == undefined) {
      throw Error(`The server's account balance cannot be retrieved, please try again.`);
    }

    const remaining = BigInt(balanceRaw);

    const remainingDecimal = remaining.toString(10);

    const block = {};
    block.type = 'state';
    block.account = accountAddress;
    block.previous = previous;
    block.representative = representative;
    block.balance = remainingDecimal;
    block.link = '0000000000000000000000000000000000000000000000000000000000000000';
    block.work = work;
    block.signature = await sign(privateKey, block);


    /* istanbul ignore if */
    if (LOG_CHANGE) {
      console.log('STARTED change', block);
    }
    try {
      const processResponse = await bananodeApi.process(block, 'change');
      /* istanbul ignore if */
      if (LOG_CHANGE) {
        console.log('SUCCESS change', processResponse);
      }
      return processResponse;
    } catch (e) {
    /* istanbul ignore if */
      if (LOG_RECEIVE) {
        console.log('FAILURE receive', JSON.stringify(e));
      }
      throw Error(e.message);
    }
  };

  const receive = async (bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw, accountPrefix) => {
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (publicKey === undefined) {
      throw Error('publicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (representative === undefined) {
      throw Error('representative is a required parameter.');
    }
    /* istanbul ignore if */
    if (previous === undefined) {
      throw Error('previous is a required parameter.');
    }
    /* istanbul ignore if */
    if (hash === undefined) {
      throw Error('hash is a required parameter.');
    }
    /* istanbul ignore if */
    if (valueRaw === undefined) {
      throw Error('valueRaw is a required parameter.');
    }
    const work = await bananodeApi.getGeneratedWork(previous);
    const accountAddress = getAccount(publicKey, accountPrefix);

    const block = {};
    block.type = 'state';
    block.account = accountAddress;
    block.previous = previous;
    block.representative = representative;
    block.balance = valueRaw;
    block.link = hash;
    block.work = work;
    block.signature = await sign(privateKey, block);

    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log('STARTED receive', block);
    }
    try {
      const processResponse = await bananodeApi.process(block, 'receive');
      /* istanbul ignore if */
      if (LOG_RECEIVE) {
        console.log('SUCCESS receive', processResponse);
      }
      return processResponse;
    } catch (e) {
      /* istanbul ignore if */
      // console.log('FAILURE receive', e.message);
      throw Error(e.message);
    }
  };


  /**
 * @typedef {Object} AccountValidationInfo
 * @property {string} message - The message describing why the account is valid or not.
 * @property {boolean} valid - True if account is valid.
 */

  /**
  * Returns an object saying if the banano account is valid or not.

  * If the account is not valid, the message describes why it is not valid.
  *
  * @memberof BananoUtil
  * @param {string} account the account.
  * @return {AccountValidationInfo} an object saying if the account is valid, and why.
  */
  const getBananoAccountValidationInfo = (account) => {
    if (account === null) {
      return {
        message: 'Invalid BANANO Account (null)',
        valid: false,
      };
    }
    if (account === undefined) {
      return {
        message: 'Invalid BANANO Account (undefined)',
        valid: false,
      };
    }
    if (account.length == 64) {
      if (!account.startsWith('ban_1') && !account.startsWith('ban_3')) {
        return {
          message: 'Invalid BANANO Account (does not start with ban_1 or ban_3)',
          valid: false,
        };
      }
    } else {
      return {
        message: 'Invalid BANANO Account (not 64 characters)',
        valid: false,
      };
    }
    const accountCrop = account.substring(4, 64);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(accountCrop);
    if (!isValid) {
      return {
        message: `Invalid BANANO account (characters after ban_ must be one of:13456789abcdefghijkmnopqrstuwxyz)`,
        valid: false,
      };
    };

    try {
      getAccountPublicKey(account);
    } catch (error) {
      return {
        message: `Invalid BANANO account (${error.message})`,
        valid: false,
      };
    }
    return {
      message: 'valid',
      valid: true,
    };
  };

  /**
    * Returns an object saying if the nano account is valid or not.
    * If the account is not valid, the message describes why it is not valid.
    *
    * @memberof BananoUtil
    * @param {string} account the account.
    * @return {AccountValidationInfo} an object saying if the account is valid, and why.
    */
  const getNanoAccountValidationInfo = (account) => {
    if (account === null) {
      return {
        message: 'Invalid NANO Account (null)',
        valid: false,
      };
    }
    if (account === undefined) {
      return {
        message: 'Invalid NANO Account (undefined)',
        valid: false,
      };
    }
    if (account.length == 65) {
      if (!account.startsWith('nano_1') && !account.startsWith('nano_3')) {
        return {
          message: 'Invalid NANO Account (does not start with nano_1 or nano_3)',
          valid: false,
        };
      }
    } else {
      return {
        message: 'Invalid NANO Account (not 65 characters)',
        valid: false,
      };
    }
    const accountCrop = account.substring(5, 65);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(accountCrop);
    if (!isValid) {
      return {
        message: `Invalid NANO account (characters after nano_ must be one of:13456789abcdefghijkmnopqrstuwxyz)`,
        valid: false,
      };
    };

    try {
      getAccountPublicKey(account);
    } catch (error) {
      return {
        message: `Invalid NANO account (${error.message})`,
        valid: false,
      };
    }
    return {
      message: 'valid',
      valid: true,
    };
  };


  const isAccountOpen = async (bananodeApi, account) => {
    const history = await bananodeApi.getAccountHistory( account, 1 );
    const historyHistory = history.history;
    const historyHistoryLength = historyHistory.length;
    return historyHistoryLength !== 0;
  };


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.decToHex = decToHex;
    exports.incrementBytes = incrementBytes;
    exports.getNanoAccountValidationInfo = getNanoAccountValidationInfo;
    exports.getBananoAccountValidationInfo = getBananoAccountValidationInfo;
    exports.receive = receive;
    exports.open = open;
    exports.change = change;
    exports.getRawStrFromMajorAmountStr = getRawStrFromMajorAmountStr;
    exports.getRawStrFromMinorAmountStr = getRawStrFromMinorAmountStr;
    exports.getAccount = getAccount;
    exports.getPublicKey = getPublicKey;
    exports.getPrivateKey = getPrivateKey;
    exports.hash = hash;
    exports.sign = sign;
    exports.signHash = signHash;
    exports.verify = verify;
    exports.getAccountPublicKey = getAccountPublicKey;
    exports.send = send;
    exports.getHashCPUWorker = getHashCPUWorker;
    exports.getZeroedWorkBytes = getZeroedWorkBytes;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.isWorkValid = isWorkValid;
    exports.getAmountPartsFromRaw = getAmountPartsFromRaw;
    exports.sendFromPrivateKey = sendFromPrivateKey;
    exports.sendFromPrivateKeyWithRepresentative = sendFromPrivateKeyWithRepresentative;
    exports.sendFromPrivateKeyWithRepresentativeAndPrevious = sendFromPrivateKeyWithRepresentativeAndPrevious;
    exports.getAccountSuffix = getAccountSuffix;
    exports.isAccountSuffixValid = isAccountSuffixValid;
    exports.isAccountOpen = isAccountOpen;
    exports.isSeedValid = isSeedValid;
    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.bananoUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const bananoUtil = require('./banano-util.js');

  const MAX_ACCOUNTS_PENDING = 10;

  const LOG_SWEEP = false;

  const receive = async (loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, accountPrefix) => {
  /* istanbul ignore if */
    if (loggingUtil === undefined) {
      throw Error('loggingUtil is required.');
    }
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is required.');
    }
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error('account is required.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is required.');
    }
    /* istanbul ignore if */
    if (representative === undefined) {
      throw Error('representative is required.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is required.');
    }
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('STARTED receive account', account);
    }
    const pending = await bananodeApi.getAccountsPending([account], MAX_ACCOUNTS_PENDING);
    const response = {};
    response.pendingCount = 0;
    response.pendingBlocks = [];
    response.receiveCount = 0;
    response.receiveBlocks = [];
    response.pendingMessage = '';
    response.receiveMessage = '';
    if ((pending !== undefined) && (pending.blocks !== undefined) && (pending.blocks[account] !== undefined)) {
      const pendingHashes = Object.keys(pending.blocks[account]);
      response.pendingMessage = `pending ${pendingHashes.length} blocks, of max ${MAX_ACCOUNTS_PENDING}.`;
      response.pendingCount = pendingHashes.length;
      response.pendingBlocks = pendingHashes;
      /* istanbul ignore if */
      if (LOG_SWEEP) {
        loggingUtil.log('INTERIM receive pendingHashes', pendingHashes);
      }
      if (pendingHashes.length > 0) {
        const sweepBlocks = await sweep(loggingUtil, bananodeApi, privateKey, representative, specificPendingBlockHash, accountPrefix);
        response.receiveMessage = `received ${sweepBlocks.length} blocks.`;
        response.receiveCount = sweepBlocks.length;
        response.receiveBlocks = sweepBlocks;
      }
    } else {
      response.pendingMessage = `pending unknown blocks, of max ${MAX_ACCOUNTS_PENDING}.`;
    }
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('SUCCESS receive account', account);
    }
    return response;
  };


  const sweep = async (loggingUtil, bananodeApi, privateKey, representative, specificPendingBlockHash, accountPrefix) => {
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('STARTED sweep');
    }
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, accountPrefix);
    const accountsPending = await bananodeApi.getAccountsPending([account], MAX_ACCOUNTS_PENDING);
    const history = await bananodeApi.getAccountHistory(account, 1);
    const historyHistory = history.history;

    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log(`INTERIM sweep accountsPending`, accountsPending);
    }

    const accountOpenAndReceiveBlocks = [];

    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log(`INTERIM sweep historyHistory.length`, historyHistory.length);
    }
    if (historyHistory.length == 0) {
      let isFirstPending = true;
      const pendingBlockHashs = Object.keys(accountsPending.blocks[account]);
      /* istanbul ignore if */
      if (LOG_SWEEP) {
        loggingUtil.log(`INTERIM sweep pendingBlockHashs`, pendingBlockHashs);
      }
      for (let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        if ((specificPendingBlockHash == undefined) || specificPendingBlockHash == pendingBlockHash) {
          const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
          if (isFirstPending) {
            const pending = pendingBlockHash;
            /* istanbul ignore if */
            if (LOG_SWEEP) {
              loggingUtil.log(`INTERIM STARTED sweep openBlockHash pending`, pending);
            }
            const openBlockHash = await bananoUtil.open(bananodeApi, privateKey, publicKey, account, pending, pendingValueRaw, accountPrefix);
            /* istanbul ignore if */
            if (LOG_SWEEP) {
              loggingUtil.log(`INTERIM SUCCESS sweep openBlockHash`, account, openBlockHash);
            }
            accountOpenAndReceiveBlocks.push(openBlockHash);
            isFirstPending = false;
          } else {
            const frontiers = await bananodeApi.getFrontiers(account, 1);
            const previous = frontiers.frontiers[account];
            const hash = pendingBlockHash;
            const valueRaw = pendingValueRaw;
            const receiveBlockHash = await bananoUtil.receive(bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw, accountPrefix);
            /* istanbul ignore if */
            if (LOG_SWEEP) {
              loggingUtil.log(`INTERIM sweep receiveBlockHash`, account, receiveBlockHash);
            }
            accountOpenAndReceiveBlocks.push(receiveBlockHash);
          }
        }
      }
    } else {
      const pendingBlockHashs = Object.keys(accountsPending.blocks[account]);
      for (let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        if ((specificPendingBlockHash == undefined) || specificPendingBlockHash == pendingBlockHash) {
          const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
          const frontiers = await bananodeApi.getFrontiers(account, 1);
          /* istanbul ignore if */
          if (LOG_SWEEP) {
            loggingUtil.log(`INTERIM sweep hasHistory frontiers`, frontiers);
          }
          const accountBalanceRaw = await bananodeApi.getAccountBalanceRaw(account, accountPrefix);

          const previous = frontiers.frontiers[account];
          const hash = pendingBlockHash;
          const valueRaw = (BigInt(pendingValueRaw) + BigInt(accountBalanceRaw)).toString();
          const receiveBlockHash = await bananoUtil.receive(bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw, accountPrefix);
          /* istanbul ignore if */
          if (LOG_SWEEP) {
            loggingUtil.log(`INTERIM sweep hasHistory receiveBlockHash`, account, receiveBlockHash);
          }
          accountOpenAndReceiveBlocks.push(receiveBlockHash);
        }
      }
      /* istanbul ignore if */
      if (LOG_SWEEP) {
        loggingUtil.log(`INTERIM sweep hasHistory`, account, historyHistory.length, accountsPending.blocks[account]);
      }
    }
    /* istanbul ignore if */
    if (LOG_SWEEP) {
      loggingUtil.log('SUCCESS sweep', accountOpenAndReceiveBlocks);
    }

    return accountOpenAndReceiveBlocks;
  };


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.receive = receive;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.depositUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const bananoUtil = require('./banano-util.js');

  const LOG_WITHDRAW = false;

  const withdraw = async (loggingUtil, bananodeApi, privateKey, toAccount, amountBananos, accountPrefix) => {
  /* istanbul ignore if */
    if (loggingUtil === undefined) {
      throw Error('loggingUtil is required.');
    }
    /* istanbul ignore if */
    if (bananodeApi === undefined) {
      throw Error('bananodeApi is required.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is required.');
    }
    /* istanbul ignore if */
    if (toAccount === undefined) {
      throw Error('toAccount is required.');
    }
    /* istanbul ignore if */
    if (amountBananos === undefined) {
      throw Error('amountBananos is required.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is required.');
    }
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const fromAccount = bananoUtil.getAccount(publicKey, accountPrefix);
    const amountRaw = bananoUtil.getRawStrFromMajorAmountStr(amountBananos.toString(), accountPrefix);
    /* istanbul ignore if */
    if (LOG_WITHDRAW) {
      loggingUtil.log('STARTED withdraw fromAccount', fromAccount,
          'toAccount', toAccount, 'amountRaw', amountRaw);
    }
    const response = await bananoUtil.sendFromPrivateKey(bananodeApi, privateKey, toAccount, amountRaw, accountPrefix);
    /* istanbul ignore if */
    if (LOG_WITHDRAW) {
      loggingUtil.log('SUCCESS withdraw fromAccount', fromAccount,
          'toAccount', toAccount, 'amountRaw', amountRaw, 'response', response);
    }
    return response;
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.withdraw = withdraw;
    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.withdrawUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';


// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack
  const nacl = require( '../../libraries/tweetnacl/nacl.js' );

  const bananoUtil = require( './banano-util.js' );

  const blake = require('../../libraries/blake2b/blake2b.js');

  const LOG_SWEEP_SEED_TO_INDEX = false;

  const LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO = false;

  const LOG_SEND = false;

  const LOG_RECEIVE = false;

  /**
 * Gets the camo public key from a private key.
 *
 * a normal banano public key is used in ECDSA.
 *
 * a camo public key is used in ECDH.
 *
 * this is why the derivation is different for the two keys.
 *
 * @memberof CamoUtil
 * @param {string} privateKey the private key.
 * @return {string} the camo public key.
 */
  const getCamoPublicKey = ( privateKey ) => {
    const privateKeyBytes = bananoUtil.hexToBytes( privateKey );
    const camoPublicKeyBytes = getCamoPublicKeyBytes( privateKeyBytes );
    const camoPublicKey = bananoUtil.bytesToHex( camoPublicKeyBytes );
    return camoPublicKey;
  };

  const getCamoPublicKeyBytes = ( privateKeyBytes ) => {
    const camoPrivateKeyBytes = nacl.camo.hashsecret( privateKeyBytes );
    const camoPublicKeyBytes = nacl.camo.scalarMult.base( camoPrivateKeyBytes );
    return camoPublicKeyBytes;
  };

  const getSharedSecretBytes = ( privateKeyBytes, publicKeyBytes ) => {
    const camoPrivateKeyBytes = nacl.camo.hashsecret( privateKeyBytes );
    const secretBytes = nacl.camo.scalarMult( camoPrivateKeyBytes, publicKeyBytes );

    const context = blake.blake2bInit( 32 );
    blake.blake2bUpdate( context, secretBytes );
    const hashedSecretBytes = blake.blake2bFinal( context );

    return hashedSecretBytes;
  };


  /**
 * Gets the shared secret from a camo public key and a private key.
 *
 * @memberof CamoUtil
 * @param {string} privateKey the private key.
 * @param {string} publicKey the public key.
 * @return {string} the shared secret.
 */
  const getSharedSecret = ( privateKey, publicKey ) => {
    const privateKeyBytes = bananoUtil.hexToBytes( privateKey );
    const publicKeyBytes = bananoUtil.hexToBytes( publicKey );
    const secretBytes = getSharedSecretBytes( privateKeyBytes, publicKeyBytes );
    const secret = bananoUtil.bytesToHex( secretBytes );
    return secret;
  };

  const isUnopenedPrivateKeyInSeed = async ( bananodeApi, seed, seedIx, amountPrefix ) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const privateKey = bananoUtil.getPrivateKey( seed, seedIx );
    return await isUnopenedPrivateKey( bananodeApi, privateKey, amountPrefix );
  };

  const isUnopenedPrivateKey = async ( bananodeApi, privateKey, amountPrefix) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const publicKey = await bananoUtil.getPublicKey( privateKey );
    const account = bananoUtil.getAccount( publicKey, amountPrefix );
    // console.log( 'account', account );
    const history = await bananodeApi.getAccountHistory( account, 1 );
    // console.log( 'history', JSON.stringify( history, undefined, '  ' ) );
    const historyHistory = history.history;
    // console.log( 'historyHistory', JSON.stringify( historyHistory, undefined, '  ' ) );
    const historyHistoryLength = historyHistory.length;
    // console.log( 'historyHistoryLength', historyHistoryLength );
    const historyHistoryLengthIsZero = historyHistoryLength == 0;

    // console.log( 'isUnopenedPrivateKey', account, historyHistoryLengthIsZero );

    return historyHistoryLengthIsZero;
  };

  const getFirstUnopenedPrivateKey = async ( bananodeApi, seed, amountPrefix ) => {
  /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( seed === undefined ) {
      throw Error( 'seed is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    let seedIx = 0;
    let isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx, amountPrefix );
    while ( !isUnopenedPrivateKeyFlag ) {
      seedIx++;
      isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx, amountPrefix );
    }
    //    console.log( 'getFirstUnopenedPrivateKey', seed, seedIx );
    return bananoUtil.getPrivateKey( seed, seedIx );
  };

  const receiveSeed = async ( bananodeApi, seed, amountPrefix ) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( seed === undefined ) {
      throw Error( 'seed is a required parameter.' );
    }
    const unopenedAccounts = [];
    const privateKeyByAccount = {};
    const publicKeyByAccount = {};
    const representativeByAccount = {};

    const getAccount = async ( seed, seedIx ) => {
      const privateKey = bananoUtil.getPrivateKey( seed, seedIx );
      const publicKey = await bananoUtil.getPublicKey( privateKey );
      const account = bananoUtil.getAccount( publicKey, amountPrefix );
      const camoPublicKey = getCamoPublicKey( privateKey );
      const camoAccount = bananoUtil.getAccount( camoPublicKey, amountPrefix );

      privateKeyByAccount[account] = privateKey;
      publicKeyByAccount[account] = publicKey;
      representativeByAccount[account] = camoAccount;

      return account;
    };

    let seedIx = 0;
    let isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx, amountPrefix);
    unopenedAccounts.push( await getAccount( seed, seedIx, amountPrefix ) );
    while ( !isUnopenedPrivateKeyFlag ) {
    /* istanbul ignore if */
      if (LOG_RECEIVE) {
        console.log( 'INTERIM camo.receiveSeed', 'unopenedAccounts', 'seedIx', seedIx );
      }

      seedIx++;
      unopenedAccounts.push( await getAccount( seed, seedIx ) );
      isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed( bananodeApi, seed, seedIx, amountPrefix );
    }
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log( 'accountsPending request', unopenedAccounts);
    }
    const accountsPending = await bananodeApi.getAccountsPending( unopenedAccounts, -1 );
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log( 'accountsPending response', accountsPending );
    }


    const accounts = Object.keys( accountsPending.blocks );

    const accountOpenAndReceiveBlocks = [];

    for ( let accountIx = 0; accountIx < accounts.length; accountIx++ ) {
      const account = accounts[accountIx];
      const privateKey = privateKeyByAccount[account];
      const publicKey = publicKeyByAccount[account];
      const representative = representativeByAccount[account];
      let isAccountOpenFlag = await bananoUtil.isAccountOpen(bananodeApi, account);
      const pendingBlockHashs = Object.keys( accountsPending.blocks[account] );
      for ( let pendingBlockHashIx = 0; pendingBlockHashIx < pendingBlockHashs.length; pendingBlockHashIx++ ) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        const pendingValueRaw = accountsPending.blocks[account][pendingBlockHash];
        if ( pendingBlockHashIx !== 0 ) {
          isAccountOpenFlag = false;
        }

        const blockHash = await receiveBlock(bananodeApi, isAccountOpenFlag, account, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw, amountPrefix);

        accountOpenAndReceiveBlocks.push( blockHash );
      }
    }

    return accountOpenAndReceiveBlocks;
  };

  const receiveBlock = async (bananodeApi, isAccountOpenFlag, account, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw, amountPrefix) => {
  /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( isAccountOpenFlag === undefined ) {
      throw Error( 'isAccountOpenFlag is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( account === undefined ) {
      throw Error( 'account is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( privateKey === undefined ) {
      throw Error( 'privateKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( publicKey === undefined ) {
      throw Error( 'publicKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( representative === undefined ) {
      throw Error( 'representative is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( pendingBlockHash === undefined ) {
      throw Error( 'pendingBlockHash is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( pendingValueRaw === undefined ) {
      throw Error( 'pendingValueRaw is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const frontiers = await bananodeApi.getFrontiers( account, 1 );
    if (isAccountOpenFlag) {
      const previous = frontiers.frontiers[account];
      const hash = pendingBlockHash;
      const valueRaw = pendingValueRaw;
      const receiveBlockHash = await bananoUtil.receive( bananodeApi, privateKey, publicKey, representative, previous, hash, valueRaw, amountPrefix );

      /* istanbul ignore if */
      if ( LOG_SWEEP_SEED_TO_INDEX ) {
        console.log( `accountsPending receiveBlockHash[${accountIx}]`, account, receiveBlockHash );
      }
      return receiveBlockHash;
    } else {
      const pending = pendingBlockHash;
      const openBlockHash = await bananoUtil.open( bananodeApi, privateKey, publicKey, representative, pending, pendingValueRaw, amountPrefix );

      /* istanbul ignore if */
      if ( LOG_SWEEP_SEED_TO_INDEX ) {
        console.log( `accountsPending openBlockHash[${accountIx}]`, account, openBlockHash );
      }
      return openBlockHash;
    }
  };

  const getSharedSecretFromRepresentative = async ( bananodeApi, toPrivateKey, fromPublicKey, amountPrefix ) => {
  /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( toPrivateKey === undefined ) {
      throw Error( 'toPrivateKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( fromPublicKey === undefined ) {
      throw Error( 'fromPublicKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const fromAccount = bananoUtil.getAccount( fromPublicKey, amountPrefix );
    const fromRepresentative = await bananodeApi.getAccountRepresentative( fromAccount );
    if (fromRepresentative) {
      const fromCamoPublicKey = bananoUtil.getAccountPublicKey( fromRepresentative );
      const sharedSecret = getSharedSecret( toPrivateKey, fromCamoPublicKey );
      return sharedSecret;
    } else {
      return undefined;
    }
  };

  const getBalanceRaw = async ( bananodeApi, toPrivateKey, fromPublicKey, amountPrefix ) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const sharedSecret = await getSharedSecretFromRepresentative( bananodeApi, toPrivateKey, fromPublicKey, amountPrefix );

    const seed = sharedSecret;

    const ZERO = BigInt( 0 );

    let balanceRaw = ZERO;

    let seedIx = 0;
    let accountHasBalance = true;
    while ( accountHasBalance ) {
      const privateKey = bananoUtil.getPrivateKey( seed, seedIx );
      const publicKey = await bananoUtil.getPublicKey( privateKey );
      const account = bananoUtil.getAccount( publicKey, amountPrefix );
      const accountBalanceRaw = await bananodeApi.getAccountBalanceRaw( account );

      const accountBalanceRawBigInt = BigInt( accountBalanceRaw );
      // console.log( 'getBalanceRaw', account, accountBalanceRawBigInt);

      if ( accountBalanceRawBigInt == ZERO ) {
        accountHasBalance = false;
      } else {
        balanceRaw += accountBalanceRawBigInt;
        seedIx++;
      }
    }

    return balanceRaw.toString();
  };

  // def myfunc(x):
  //    powers = []
  //    i = 1
  //    while i <= x:
  //        if i & x:
  //            powers.append(i)
  //        i <<= 1
  //    return powers

  const splitBigIntIntoPowersOfTwo = ( value ) => {
    // const ZERO = BigInt( 0 );
    const ONE = BigInt( 1 );

    /* istanbul ignore if */
    if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
      console.log( 'STARTED splitBigIntIntoPowersOfTwo', 'value', value );
    }

    const powersOfTwo = [];

    let divisor = ONE;

    /* istanbul ignore if */
    if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
      console.log( `INTERIM splitBigIntIntoPowersOfTwo`,
          'value', value, 'divisor', divisor );
    }
    while ( divisor <= value ) {
    /* istanbul ignore if */
      if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
        console.log( `INTERIM splitBigIntIntoPowersOfTwo`,
            'while ( divisor <= value )',
            'value', value, 'divisor', divisor );
      }
      if ( divisor & value ) {
      /* istanbul ignore if */
        if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
          console.log( `INTERIM splitBigIntIntoPowersOfTwo`,
              '(divisor & value)=true',
              'value', value, 'divisor', divisor );
        }
        powersOfTwo.push( divisor );
      } else {
      /* istanbul ignore if */
        if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
          console.log( `INTERIM splitBigIntIntoPowersOfTwo`,
              '(divisor & value)=false',
              'value', value, 'divisor', divisor );
        }
      }

      divisor <<= ONE;

      /* istanbul ignore if */
      if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
        console.log( `INTERIM splitBigIntIntoPowersOfTwo`, value, divisor );
      }
    }

    /* istanbul ignore if */
    if ( LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO ) {
      console.log( 'SUCCESS splitBigIntIntoPowersOfTwo', value, powersOfTwo );
    }

    return powersOfTwo;
  };

  const send = async ( bananodeApi, fundingPrivateKey, fromPrivateKey, toPublicKey, amountRaw, amountPrefix ) => {
  /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( fundingPrivateKey === undefined ) {
      throw Error( 'fundingPrivateKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( fromPrivateKey === undefined ) {
      throw Error( 'fromPrivateKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( toPublicKey === undefined ) {
      throw Error( 'toPublicKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( amountRaw === undefined ) {
      throw Error( 'amountRaw is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }

    /* istanbul ignore if */
    if ( LOG_SEND ) {
      console.log( 'camo.send.amountRaw', amountRaw );
    }

    const bananoParts = bananoUtil.getAmountPartsFromRaw( amountRaw, amountPrefix );

    /* istanbul ignore if */
    if ( LOG_SEND ) {
      console.log( 'camo.send.bananoParts', bananoParts );
    }

    const powersOfTwoBigInts = splitBigIntIntoPowersOfTwo( BigInt( bananoParts[bananoParts.majorName] ) );

    /* istanbul ignore if */
    if ( LOG_SEND ) {
      console.log( 'camo.send.powersOfTwoBigInts', powersOfTwoBigInts );
    }

    const amounts = [];

    if ( bananoParts[bananoParts.minorName] !== '0' ) {
    /* istanbul ignore if */
      if ( LOG_SEND ) {
        console.log( 'camo.send.bananoParts[bananoParts.minorName]', bananoParts[bananoParts.minorName] );
      }
      const banoshiRaw = bananoUtil.getRawStrFromMinorAmountStr( bananoParts[bananoParts.minorName], amountPrefix);
      /* istanbul ignore if */
      if ( LOG_SEND ) {
        console.log( 'camo.send.banoshiRaw', banoshiRaw );
      }
      amounts.push( banoshiRaw );
    }
    if ( bananoParts.raw !== '0' ) {
    /* istanbul ignore if */
      if ( LOG_SEND ) {
        console.log( 'camo.send.raw', bananoParts.raw );
      }
      amounts.push( bananoParts.raw );
    }

    for ( let powersOfTwoBigIntIx = 0; powersOfTwoBigIntIx < powersOfTwoBigInts.length; powersOfTwoBigIntIx++ ) {
      const powersOfTwoBigInt = powersOfTwoBigInts[powersOfTwoBigIntIx];
      const powersOfTwoRaw = bananoUtil.getRawStrFromMajorAmountStr( powersOfTwoBigInt.toString(), amountPrefix);
      /* istanbul ignore if */
      if ( LOG_SEND ) {
        console.log( `camo.send.powersOfTwoRaw[${powersOfTwoBigIntIx}]`, powersOfTwoRaw );
      }
      amounts.push( powersOfTwoRaw );
    }

    const sharedSecret = await getSharedSecretFromRepresentative( bananodeApi, fromPrivateKey, toPublicKey, amountPrefix);
    /* istanbul ignore if */
    if ( LOG_SEND ) {
      console.log( 'camo.send.sharedSecret', sharedSecret );
    }

    const destSeed = sharedSecret;

    const hashes = [];

    let previous;

    for ( let amountIx = 0; amountIx < amounts.length; amountIx++ ) {
      const amount = amounts[amountIx];
      const amountRaw = amount;
      const destSeedIx = amountIx;
      const destPrivateKey = bananoUtil.getPrivateKey( destSeed, destSeedIx );
      const destPublicKey = await bananoUtil.getPublicKey( destPrivateKey );
      const destAccount = bananoUtil.getAccount( destPublicKey, amountPrefix );
      /* istanbul ignore if */
      if ( LOG_SEND ) {
        console.log( `STARTED camo.send[${destSeedIx}]`, fundingPrivateKey, destAccount, amountRaw );
      }
      const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious( bananodeApi, fundingPrivateKey, destAccount, amountRaw, undefined, previous, amountPrefix );
      /* istanbul ignore if */
      if ( LOG_SEND ) {
        console.log( `SUCCESS camo.send[${destSeedIx}]`, 'destPrivateKey', destPrivateKey, 'hash', hash );
      }
      previous = hash;
      hashes.push( hash );
    }

    return hashes;
  };

  const receive = async (bananodeApi, toPrivateKey, fromPublicKey, amountPrefix) => {
  /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( toPrivateKey === undefined ) {
      throw Error( 'toPrivateKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( fromPublicKey === undefined ) {
      throw Error( 'fromPublicKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }

    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log( 'STARTED camo.receive', toPrivateKey, fromPublicKey );
    }

    const sharedSecret = await getSharedSecretFromRepresentative( bananodeApi, toPrivateKey, fromPublicKey, amountPrefix);
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log( 'INTERIM camo.receive', 'sharedSecret', sharedSecret );
    }
    const seed = sharedSecret;

    const returnValue = await receiveSeed( bananodeApi, seed, amountPrefix);
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log( 'SUCCESS camo.receive', returnValue );
    }
    return returnValue;
  };


  /**
 * Get the camo account for a given camo public key.
 *
 * @memberof CamoUtil
 * @param {string} camoPublicKey the camo public key.
 * @return {string} the camo account.
 */
  const getCamoAccount = (camoPublicKey) => {
    const accountSuffix = bananoUtil.getAccountSuffix(camoPublicKey);
    return `camo_${accountSuffix}`;
  };

  /**
* @memberof CamoUtil
 * checks if a camo account is valid.
 * @param {string} camoAccount the camo account.
 * @return {boolean} true if the camo account is valid.
 */
  const isCamoAccountValid = (camoAccount) => {
    if (((!camoAccount.startsWith('camo_1')) &&
        (!camoAccount.startsWith('camo_3')))) {
      const retval = {};
      retval.valid = false;
      retval.message = `Invalid CAMO BANANO Account prefix '${camoAccount}'`;
      return retval;
    }
    if (camoAccount.length !== 65) {
      const retval = {};
      retval.valid = false;
      retval.message = `Invalid CAMO BANANO Account length ${camoAccount.length} of '${camoAccount}'`;
      return retval;
    }
    const accountSuffix = camoAccount.substring(5, 65);
    const isSuffixValid = bananoUtil.isAccountSuffixValid(accountSuffix);
    if (!isSuffixValid.valid) {
      const retval = {};
      retval.valid = false;
      retval.message = `Invalid CAMO BANANO Account '${camoAccount}', ${isSuffixValid.message}`;
      return retval;
    }
    const retval = {};
    retval.valid = true;
    retval.message = '';
    return retval;
  };

  const getSharedAccountData = async (bananodeApi, privateKey, publicKey, sharedSeedIx, amountPrefix) => {
  /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( privateKey === undefined ) {
      throw Error( 'privateKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( publicKey === undefined ) {
      throw Error( 'publicKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( sharedSeedIx === undefined ) {
      throw Error( 'sharedSeedIx is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const sharedSecret = await getSharedSecretFromRepresentative( bananodeApi, privateKey, publicKey, amountPrefix );
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const sharedPrivateKey = bananoUtil.getPrivateKey( sharedSeed, sharedSeedIx );
      const sharedPublicKey = await bananoUtil.getPublicKey( sharedPrivateKey );
      const sharedAccount = bananoUtil.getAccount( sharedPublicKey, amountPrefix );
      const data = {};
      data.sharedSeed = sharedSeed;
      data.sharedPrivateKey = sharedPrivateKey;
      data.sharedPublicKey = sharedPublicKey;
      data.sharedAccount = sharedAccount;
      return data;
    } else {
      return undefined;
    }
  };

  const getAccountsPending = async (bananodeApi, toPrivateKey, fromPublicKey, sharedSeedIx, count, amountPrefix) => {
  /* istanbul ignore if */
    if ( bananodeApi === undefined ) {
      throw Error( 'bananodeApi is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( toPrivateKey === undefined ) {
      throw Error( 'toPrivateKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( fromPublicKey === undefined ) {
      throw Error( 'fromPublicKey is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( sharedSeedIx === undefined ) {
      throw Error( 'sharedSeedIx is a required parameter.' );
    }
    /* istanbul ignore if */
    if ( count === undefined ) {
      throw Error( 'count is a required parameter.' );
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error( 'amountPrefix is a required parameter.' );
    }
    const accountData = await getSharedAccountData(bananodeApi, toPrivateKey, fromPublicKey, sharedSeedIx, amountPrefix);
    if (accountData) {
      const accounts = [accountData.sharedAccount];
      return bananodeApi.getAccountsPending(accounts, count);
    }
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.receiveSeed = receiveSeed;
    exports.receive = receive;
    exports.send = send;
    exports.getBalanceRaw = getBalanceRaw;
    // exports.isHashInPendingOfPrivateKey = isHashInPendingOfPrivateKey;
    // exports.sweepSeedToIndex = sweepSeedToIndex;
    exports.getSharedSecret = getSharedSecret;
    exports.getSharedSecretBytes = getSharedSecretBytes;
    exports.getCamoPublicKey = getCamoPublicKey;
    exports.getCamoPublicKeyBytes = getCamoPublicKeyBytes;
    // exports.getSharedSeed = getSharedSeed;
    exports.getFirstUnopenedPrivateKey = getFirstUnopenedPrivateKey;
    // exports.openAccountWithPrivateKey = openAccountWithPrivateKey;
    exports.getCamoAccount = getCamoAccount;
    exports.isCamoAccountValid = isCamoAccountValid;
    exports.getAccountsPending = getAccountsPending;
    exports.getSharedAccountData = getSharedAccountData;
    exports.receiveBlock = receiveBlock;
    exports.getSharedSecretFromRepresentative = getSharedSecretFromRepresentative;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoin.bananojs.camoUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
'use strict';

// STARTED TOP nodejs/browser hack
(function() {
// FINISHED TOP nodejs/browser hack

  const bananoUtil = require('./app/scripts/banano-util.js');
  const realBananodeApi = require('./app/scripts/bananode-api.js');
  const camoUtil = require('./app/scripts/camo-util.js');
  const depositUtil = require('./app/scripts/deposit-util.js');
  const withdrawUtil = require('./app/scripts/withdraw-util.js');
  const loggingUtil = require('./app/scripts/logging-util.js');

  const BANANO_PREFIX = 'ban_';

  const NANO_PREFIX = 'nano_';

  let bananodeApi = realBananodeApi;

  /**
 * Sets the Bananode Api (useful for overriding some methods)
 * @memberof Main
 * @param {string} _bananodeApi the new bananodeApi
 * @return {undefined} returns nothing.
 */
  const setBananodeApi = (_bananodeApi) => {
    bananodeApi = _bananodeApi;
  };

  /**
   * converts amount from decimal to bananoParts.
   * @memberof BananoUtil
   * @param {string} decimalAmount the decimal amount of bananos.
   * @return {BananoParts} returns the banano parts of the decimal amount.
   */
  const getBananoPartsFromDecimal = (decimalAmount) => {
    const raw = getBananoDecimalAmountAsRaw(decimalAmount);
    const bananoParts = getBananoPartsFromRaw(raw);
    return bananoParts;
  };

  /**
   * converts amount from bananoParts to decimal.
   * @memberof BananoUtil
   * @param {BananoParts} bananoParts the banano parts to describe.
   * @return {string} returns the decimal amount of bananos.
   */
  const getBananoPartsAsDecimal = (bananoParts) => {
    let bananoDecimal = '';
    const banano = bananoParts[bananoParts.majorName];
    if (banano !== undefined) {
      bananoDecimal += banano;
    } else {
      bananoDecimal += '0';
    }

    const banoshi = bananoParts[bananoParts.minorName];
    if ((banoshi !== undefined) || (bananoParts.raw !== undefined)) {
      bananoDecimal += '.';
    }

    if (banoshi !== undefined) {
      if (banoshi.length == 1) {
        bananoDecimal += '0';
      }
      bananoDecimal += banoshi;
    }

    if (bananoParts.raw !== undefined) {
      if (banoshi === undefined) {
        bananoDecimal += '00';
      }
      const count = 27-bananoParts.raw.length;
      if (count < 0) {
        throw Error(`too many numbers in bananoParts.raw '${bananoParts.raw}', remove ${-count} of them.`);
      }
      bananoDecimal += '0'.repeat(count);
      bananoDecimal += bananoParts.raw;
    }

    return bananoDecimal;
  };

  /**
   * converts amount from decimal to raw.
   * @memberof BananoUtil
   * @param {string} amount the decimal amount.
   * @return {string} returns amount in raw.
   */
  const getBananoDecimalAmountAsRaw = (amount) => {
    const amountStr = amount.toString();
    const decimal = amountStr.indexOf('.');
    let bananoBigInt;
    if (decimal < 0) {
      bananoBigInt = BigInt(getRawStrFromBananoStr(amountStr));
    } else {
      bananoBigInt = BigInt(getRawStrFromBananoStr(amountStr.substring(0, decimal)));
    }
    let banoshiBigInt;
    if (decimal < 0) {
      banoshiBigInt = BigInt(0);
    } else {
      let banoshiRaw = amountStr.substring(decimal+1);
      // console.log('banoshiRaw', banoshiRaw);
      // console.log('banoshiRaw.length', banoshiRaw.length);
      const count = 29-banoshiRaw.length;
      if (count < 0) {
        throw Error(`too many numbers past the decimal in '${amountStr}', remove ${-count} of them.`);
      }
      banoshiRaw += '0'.repeat(count);
      banoshiBigInt = BigInt(banoshiRaw);
    }
    const rawBigInt = banoshiBigInt + bananoBigInt;
    const rawStr = rawBigInt.toString(10);
    return rawStr;
  };

  /**
   * describes the banano parts in an english description.
   * @memberof BananoUtil
   * @param {BananoParts} bananoParts the banano parts to describe.
   * @return {string} returns the description of the banano parts.
   */
  const getBananoPartsDescription = (bananoParts) => {
    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    let bananoAmountDesc = '';
    if (bananoParts[bananoParts.majorName] !== '0') {
      bananoAmountDesc += numberWithCommas(bananoParts[bananoParts.majorName]);
      bananoAmountDesc += ' ';
      bananoAmountDesc += bananoParts.majorName;
    }
    if (bananoParts[bananoParts.minorName] !== '0') {
      if (bananoAmountDesc.length > 0) {
        bananoAmountDesc += ' ';
      }
      bananoAmountDesc += bananoParts[bananoParts.minorName];
      bananoAmountDesc += ' ';
      bananoAmountDesc += bananoParts.minorName;
    }
    if (bananoParts.raw !== '0') {
      if (bananoAmountDesc.length > 0) {
        bananoAmountDesc += ' ';
      }
      bananoAmountDesc += numberWithCommas(bananoParts.raw);
      bananoAmountDesc += ' raw';
    }

    if (bananoAmountDesc.length === 0) {
      bananoAmountDesc = '0 ';
      bananoAmountDesc += bananoParts.majorName;
    }

    return bananoAmountDesc;
  };

  /**
   * Sends the amount to the account with an optional representative and
   * previous block hash.
   * If the representative is not sent, it will be pulled from the api.
   * If the previous is not sent, it will be pulled from the api.
   * Be very careful with previous, as setting it incorrectly
   * can cause an incorrect amount of funds to be sent.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} representative the representative (optional).
   * @param {string} previousHash the previous hash (optional).
   * @return {Promise<string>} returns the hash returned by the send.
   */
  const sendAmountToBananoAccountWithRepresentativeAndPrevious = async (seed, seedIx, destAccount, amountRaw, representative, previousHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, representative, previousHash, BANANO_PREFIX);
    return hash;
  };

  /**
   * Sends the amount to the account with an optional representative and
   * previous block hash.
   * If the representative is not sent, it will be pulled from the api.
   * If the previous is not sent, it will be pulled from the api.
   * Be very careful with previous, as setting it incorrectly
   * can cause an incorrect amount of funds to be sent.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} representative the representative (optional).
   * @param {string} previousHash the previous hash (optional).
   * @return {Promise<string>} returns the hash returned by the send.
   */
  const sendAmountToNanoAccountWithRepresentativeAndPrevious = async (seed, seedIx, destAccount, amountRaw, representative, previousHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const hash = await bananoUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(bananodeApi, privateKey, destAccount, amountRaw, representative, previousHash, NANO_PREFIX);
    return hash;
  };

  /**
 * Sends the amount to the banano account with a callback for success and failure.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} destAccount the destination account.
 * @param {string} amountRaw the amount to send, in raw.
 * @param {string} successCallback the callback to call upon success.
 * @param {string} failureCallback the callback to call upon failure.
 * @return {Promise<string>} returns the hash returned by the send.
 */
  const sendAmountToBananoAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
    return await bananoUtil.send(bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback, BANANO_PREFIX)
        .catch((error) => {
        // console.trace(error);
          throw Error(error);
        });
  };

  /**
 * Sends the amount to the nano account with a callback for success and failure.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} destAccount the destination account.
 * @param {string} amountRaw the amount to send, in raw.
 * @param {string} successCallback the callback to call upon success.
 * @param {string} failureCallback the callback to call upon failure.
 * @return {Promise<string>} returns the hash returned by the send.
 */
  const sendAmountToNanoAccount = async (seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) => {
    return await bananoUtil.send(bananodeApi, seed, seedIx, destAccount, amountRaw, successCallback, failureCallback, NANO_PREFIX)
        .catch((error) => {
        // console.trace(error);
          throw Error(error);
        });
  };

  /**
   * Sets the rep for an account with a given seed.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @return {Promise<string>} returns the hash returned by the change.
   */
  const changeBananoRepresentativeForSeed = async (seed, seedIx, representative) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = await bananoUtil.change(bananodeApi, privateKey, representative, BANANO_PREFIX);
    return response;
  };

  /**
   * Sets the rep for an account with a given seed.
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @return {Promise<string>} returns the hash returned by the change.
   */
  const changeNanoRepresentativeForSeed = async (seed, seedIx, representative) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = await bananoUtil.change(bananodeApi, privateKey, representative, NANO_PREFIX);
    return response;
  };

  /**
   * Recieve deposits for a nano account with a given seed.
   * @memberof DepositUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} specificPendingBlockHash a specific block hash to receive (optional).
   * @return {Promise<object>} returns the response returned by the receive.
   */
  const receiveNanoDepositsForSeed = async (seed, seedIx, representative, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, NANO_PREFIX);
    const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, NANO_PREFIX);
    return response;
  };

  /**
   * Recieve deposits for a nano account with a given seed.
   * @memberof DepositUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} specificPendingBlockHash a specific block hash to receive (optional).
   * @return {Promise<object>} returns the response returned by the receive.
   */
  const receiveBananoDepositsForSeed = async (seed, seedIx, representative, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, BANANO_PREFIX);
    const response = await depositUtil.receive(loggingUtil, bananodeApi, account, privateKey, representative, specificPendingBlockHash, BANANO_PREFIX);
    return response;
  };

  /**
 * Send a withdrawal from a banano account with a given seed.
 * @memberof WithdrawUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {Promise<object>} returns the response returned by the withdraw.
 */
  const sendBananoWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = withdrawUtil.withdraw(loggingUtil, bananodeApi, privateKey, toAccount, amountBananos, BANANO_PREFIX);
    return response;
  };

  /**
 * Send a withdrawal from a nano account with a given seed.
 * @memberof WithdrawUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {Promise<object>} returns the response returned by the withdraw.
 */
  const sendNanoWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const response = withdrawUtil.withdraw(loggingUtil, bananodeApi, privateKey, toAccount, amountBananos, NANO_PREFIX);
    return response;
  };

  /**
 * Get the balance, in raw, for an account.
 *
 * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @return {Promise<string>} the account's balance, in raw.
 */
  const getAccountBalanceRaw = async (account) => {
    return await bananodeApi.getAccountBalanceRaw(account);
  };

  /**
 * Get the balance and pending values, in raw, as an object like this one:
 * { balance: '123', pending: '123' } for an account.
 *
 * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @return {Promise<object>} the account's balances, in raw.
 */
  const getAccountBalanceAndPendingRaw = async (account) => {
    return await bananodeApi.getAccountBalanceAndPendingRaw(account);
  };

  /**
 * Get the history for an account.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_history}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @param {string} count the count to use (use -1 for all).
 * @param {string} head the head to start at (optional).
 * @param {string} raw if true, return raw history (optional).
 * @return {Promise<object>} the account's history.
 */
  const getAccountHistory = async (account, count, head, raw) => {
    return await bananodeApi.getAccountHistory(account, count, head, raw);
  };

  /**
   * Get the banano account with a given seed and index.
   *
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @return {Promise<string>} the account.
   */
  const getBananoAccountFromSeed = async (seed, seedIx) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, BANANO_PREFIX);
    return account;
  };

  /**
   * Get the banano account with a given seed and index.
   *
   * @memberof BananoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @return {Promise<string>} the account.
   */
  const getNanoAccountFromSeed = async (seed, seedIx) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    const account = bananoUtil.getAccount(publicKey, NANO_PREFIX);
    return account;
  };

  /**
 * Sets the URL to use for the node behind the Bananode Api
 * @memberof Main
 * @param {string} url the new url
 * @return {undefined} returns nothing.
 */
  const setBananodeApiUrl = (url) => {
    bananodeApi.setUrl(url);
  };

  /**
 * Get the account info for an account.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_info}
 * @memberof BananodeApi
 * @param {string} account the account to use.
 * @param {boolean} representativeFlag the representativeFlag to use (optional).
 * @return {Promise<object>} the account's info.
 */
  const getAccountInfo = async (account, representativeFlag) => {
    return await bananodeApi.getAccountInfo(account, representativeFlag);
  };

  /**
 * Get the network block count.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#block_count}
 * @memberof BananodeApi
 * @return {Promise<object>} the block count.
 */
  const getBlockCount = async () => {
    return await bananodeApi.getBlockCount();
  };

  /**
 * Open a banano account with a given seed.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} representative the representative.
 * @param {string} pendingBlockHash the pending block hash.
 * @param {string} pendingValueRaw the pending block hash.
 * @return {Promise<string>} returns the hash returned by the open.
 */
  const openBananoAccountFromSeed = async (seed, seedIx, representative, pendingBlockHash, pendingValueRaw) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    return await bananoUtil.open(bananodeApi, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw, BANANO_PREFIX);
  };

  /**
 * Open a nano account with a given seed.
 * @memberof BananoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} representative the representative.
 * @param {string} pendingBlockHash the pending block hash.
 * @param {string} pendingValueRaw the pending block hash.
 * @return {Promise<string>} returns the hash returned by the open.
 */
  const openNanoAccountFromSeed = async (seed, seedIx, representative, pendingBlockHash, pendingValueRaw) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = await bananoUtil.getPublicKey(privateKey);
    return await bananoUtil.open(bananodeApi, privateKey, publicKey, representative, pendingBlockHash, pendingValueRaw, NANO_PREFIX);
  };


  /**
 * Get the hash for a given block.
 *
 * @memberof BananoUtil
 * @param {string} block the seed to use to find the account.
 * @return {string} the block's hash.
 */
  const getBlockHash = (block) => {
    return bananoUtil.hash(block);
  };


  /**
 * signs a hash.
 *
 * @memberof BananoUtil
 * @param {string} privateKey the private key to use to sign.
 * @param {string} hash the hash to sign.
 * @return {string} the block's hash.
 */
  const signHash = (privateKey, hash) => {
    return bananoUtil.signHash(privateKey, hash);
  };


  /**
 * verifys a hash.
 *
 * @memberof BananoUtil
 * @param {string} hash the hash to verify.
 * @param {string} signature the signature to verify.
 * @param {string} publicKey the public key to use to sign.
 * @return {string} true if verification passed.
 */
  const verify = (hash, signature, publicKey) => {
    return bananoUtil.verify(hash, signature, publicKey);
  };

  /**
 * Get the signature for a given block (gets the hash of the block, and signs the hash).
 *
 * @memberof BananoUtil
 * @param {string} privateKey the private key used to sign the block.
 * @param {string} block the block to sign.
 * @return {string} the block's signature.
 */
  const getSignature = (privateKey, block) => {
    return bananoUtil.sign(privateKey, block);
  };

  /**
 * Converts a hex string to bytes in a Uint8Array.
 *
 * @memberof BananoUtil
 * @param {string} hex the hex string to use.
 * @return {Uint8Array} the bytes in a Uint8Array.
 */
  const getBytesFromHex = (hex) => {
    return bananoUtil.hexToBytes(hex);
  };

  /**
 * gets work bytes using the CPU.
 *
 * @memberof BananoUtil
 * @param {string} hash the hash to use to calculate work bytes.
 * @param {Uint8Array} workBytes the Uint8Array(8) used to store temporary calculations.
 * @return {string} the work bytes as a hex string.
 */
  const getWorkUsingCpu = (hash, workBytes) => {
    return bananoUtil.getHashCPUWorker(hash, workBytes);
  };

  /**
   * receives banano funds at a camo address.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string_array>} the received hashes in an array.
   */
  const camoBananoReceive = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.receive( bananodeApi, toPrivateKey, fromPublicKey, BANANO_PREFIX);
  };

  /**
   * receives nano funds at a camo address.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string_array>} the received hashes in an array.
   */
  const camoNanoReceive = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.receive( bananodeApi, toPrivateKey, fromPublicKey, NANO_PREFIX);
  };

  /**
   * finds a new private key to recieve more banano funds. the key would have no history.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @return {Promise<string>} the private key to use.
   */
  const getCamoBananoNextPrivateKeyForReceive = async (seed) => {
    return await camoUtil.getFirstUnopenedPrivateKey( bananodeApi, seed, BANANO_PREFIX );
  };

  /**
   * finds a new private key to recieve more banano funds. the key would have no history.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @return {Promise<string>} the private key to use.
   */
  const getCamoNanoNextPrivateKeyForReceive = async (seed) => {
    return await camoUtil.getFirstUnopenedPrivateKey( bananodeApi, seed, NANO_PREFIX );
  };

  /**
 * sends banano funds to a camo address.
 *
 * @memberof CamoUtil
 * @param {string} fundingPrivateKey the private key that sends the funds.
 * @param {string} fromCamoPrivateKey the private key used to generate the shared seed.
 * @param {string} toCamoPublicKey the public key that receives the funds.
 * @param {string} amountBananos the amount of bananos.
 * @return {Promise<string_array>} the sent hashes in an array.
 */
  const camoBananoSend = async (fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos) => {
    const amountRaw = getRawStrFromBananoStr(amountBananos);
    return await camoUtil.send( bananodeApi, fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountRaw, BANANO_PREFIX);
  };

  /**
 * sends camo funds to a camo address.
 *
 * @memberof CamoUtil
 * @param {string} fundingPrivateKey the private key that sends the funds.
 * @param {string} fromCamoPrivateKey the private key used to generate the shared seed.
 * @param {string} toCamoPublicKey the public key that receives the funds.
 * @param {string} amountBananos the amount of bananos.
 * @return {Promise<string_array>} the sent hashes in an array.
 */
  const camoNanoSend = async (fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos) => {
    const amountRaw = getRawStrFromNanoStr(amountBananos);
    return await camoUtil.send( bananodeApi, fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountRaw, NANO_PREFIX);
  };

  /**
 * sends banano funds to a camo account.
 * This function uses seed index 0 to generate the shared secret,
 * and seed index "seedIx" to get the private key that contains funds to send.
 *
 * @memberof CamoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {Promise<string_array>} the sent hashes in an array.
 */
  const camoBananoSendWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const accountValid = getCamoAccountValidationInfo(toAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const fundingPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromCamoPrivateKey = bananoUtil.getPrivateKey(seed, 0);
    const toCamoPublicKey = bananoUtil.getAccountPublicKey(toAccount);
    return await camoBananoSend( fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos);
  };

  /**
 * sends nano funds to a camo account.
 * This function uses seed index 0 to generate the shared secret,
 * and seed index "seedIx" to get the private key that contains funds to send.
 *
 * @memberof CamoUtil
 * @param {string} seed the seed to use to find the account.
 * @param {string} seedIx the index to use with the seed.
 * @param {string} toAccount the account to send to.
 * @param {string} amountBananos the amount of bananos.
 * @return {Promise<string_array>} the sent hashes in an array.
 */
  const camoNanoSendWithdrawalFromSeed = async (seed, seedIx, toAccount, amountBananos) => {
    const accountValid = getCamoAccountValidationInfo(toAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const fundingPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromCamoPrivateKey = bananoUtil.getPrivateKey(seed, 0);
    const toCamoPublicKey = bananoUtil.getAccountPublicKey(toAccount);
    return await camoNanoSend( fundingPrivateKey, fromCamoPrivateKey, toCamoPublicKey, amountBananos);
  };

  /**
   * get the pending blocks for the camo banano account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} fromAccount the account to recieve from.
   * @param {number} sharedSeedIx the index to use with the shared seed.
   * @param {number} count the max count to get.
   * @return {Promise<string_array>} the pending hashes in an array.
   */
  const camoBananoGetAccountsPending = async (seed, seedIx, fromAccount, sharedSeedIx, count) => {
    const accountValid = getCamoAccountValidationInfo(fromAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const toPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromPublicKey = bananoUtil.getAccountPublicKey(fromAccount);
    return await camoUtil.getAccountsPending(bananodeApi, toPrivateKey, fromPublicKey, sharedSeedIx, count, BANANO_PREFIX);
  };

  /**
   * get the pending blocks for the camo nano account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} fromAccount the account to recieve from.
   * @param {number} sharedSeedIx the index to use with the shared seed.
   * @param {number} count the max count to get.
   * @return {Promise<string_array>} the pending hashes in an array.
   */
  const camoNanoGetAccountsPending = async (seed, seedIx, fromAccount, sharedSeedIx, count) => {
    const accountValid = getCamoAccountValidationInfo(fromAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const toPrivateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const fromPublicKey = bananoUtil.getAccountPublicKey(fromAccount);
    return await camoUtil.getAccountsPending(bananodeApi, toPrivateKey, fromPublicKey, sharedSeedIx, count, NANO_PREFIX);
  };

  /**
 * returns data on whether a camo account is valid or not, and why.
 * @param {string} account the account to check.
 * @return {object} the account validity data.
 */
  const getCamoAccountValidationInfo = (account) => {
    const accountValid = camoUtil.isCamoAccountValid(account);
    return accountValid;
  };

  /**
   * get the banano shared account, used as an intermediary to send finds between the seed and the camo account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @return {Promise<string>} the shared account.
   */
  const getCamoBananoSharedAccountData = async (seed, seedIx, account, sharedSeedIx) => {
    const accountValid = getCamoAccountValidationInfo(account);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    return await camoUtil.getSharedAccountData(bananodeApi, privateKey, publicKey, sharedSeedIx, BANANO_PREFIX);
  };

  /**
   * get the nano shared account, used as an intermediary to send finds between the seed and the camo account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @return {Promise<string>} the shared account.
   */
  const getCamoNanoSharedAccountData = async (seed, seedIx, account, sharedSeedIx) => {
    const accountValid = getCamoAccountValidationInfo(account);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    return await camoUtil.getSharedAccountData(bananodeApi, privateKey, publicKey, sharedSeedIx, NANO_PREFIX);
  };

  /**
   * Recieve banano deposits for a camo account with a given seed.
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @param {string} specificPendingBlockHash the pending block to recieve.
   * @return {Promise<string>} the response from receiving the block.
   */
  const receiveCamoBananoDepositsForSeed = async (seed, seedIx, account, sharedSeedIx, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    const sharedSecret = await camoUtil.getSharedSecretFromRepresentative( bananodeApi, privateKey, publicKey, BANANO_PREFIX);
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const privateKey = bananoUtil.getPrivateKey(sharedSeed, sharedSeedIx);
      const camoPublicKey = await camoUtil.getCamoPublicKey(privateKey);
      const camoRepresentative = await camoUtil.getCamoAccount(camoPublicKey);
      const repPublicKey = await bananoUtil.getAccountPublicKey(camoRepresentative);
      const representative = await bananoUtil.getAccount(repPublicKey, BANANO_PREFIX);
      const response = await receiveBananoDepositsForSeed(sharedSeed, sharedSeedIx, representative, specificPendingBlockHash);
      return response;
    } else {
      return undefined;
    }
  };

  /**
   * Recieve nano deposits for a camo account with a given seed.
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @param {string} specificPendingBlockHash the pending block to recieve.
   * @return {Promise<string>} the response from receiving the block.
   */
  const receiveCamoNanoDepositsForSeed = async (seed, seedIx, account, sharedSeedIx, specificPendingBlockHash) => {
    const privateKey = bananoUtil.getPrivateKey(seed, seedIx);
    const publicKey = bananoUtil.getAccountPublicKey(account);
    const sharedSecret = await camoUtil.getSharedSecretFromRepresentative( bananodeApi, privateKey, publicKey, NANO_PREFIX );
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const privateKey = bananoUtil.getPrivateKey(sharedSeed, sharedSeedIx);
      const camoPublicKey = await camoUtil.getCamoPublicKey(privateKey);
      const camoRepresentative = await camoUtil.getCamoAccount(camoPublicKey);
      const repPublicKey = await bananoUtil.getAccountPublicKey(camoRepresentative);
      const representative = await bananoUtil.getAccount(repPublicKey, NANO_PREFIX);
      const response = await receiveNanoDepositsForSeed(sharedSeed, sharedSeedIx, representative, specificPendingBlockHash);
      return response;
    } else {
      return undefined;
    }
  };

  /**
   * gets the total banano account balance, in raw.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string>} the account balance, in raw.
   */
  const getCamoBananoAccountBalanceRaw = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.getBalanceRaw( bananodeApi, toPrivateKey, fromPublicKey, BANANO_PREFIX);
  };

  /**
   * gets the total nano account balance, in raw.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string>} the account balance, in raw.
   */
  const getCamoNanoAccountBalanceRaw = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.getBalanceRaw( bananodeApi, toPrivateKey, fromPublicKey, NANO_PREFIX);
  };

  /**
 * Get the network block count.
 *
 * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_pending}
 * @memberof BananodeApi
 * @param {string_array} accounts the array of pending accounts.
 * @param {number} count the max count to get.
 * @param {string} source if true, get source.
 * @return {Promise<object>} the account's pending blocks.
 */
  const getAccountsPending = async (accounts, count, source) => {
    return await bananodeApi.getAccountsPending(accounts, count, source);
  };

  /**
   * Converts an amount into a raw amount.
   *
   * @memberof BananoUtil
   * @param {string} amountStr the amount, as a string.
   * @param {string} amountPrefix the amount, as a string.
   * @return {string} the banano as a raw value.
   */
  const getRawStrFromBananoStr = (amountStr) => {
    return bananoUtil.getRawStrFromMajorAmountStr(amountStr, BANANO_PREFIX);
  };

  /**
  * Converts an amount into a raw amount.
  *
  * @memberof BananoUtil
  * @param {string} amountStr the amount, as a string.
  * @param {string} amountPrefix the amount, as a string.
  * @return {string} the banano as a raw value.
  */
  const getRawStrFromBanoshiStr = (amountStr) => {
    return bananoUtil.getRawStrFromMinorAmountStr(amountStr, BANANO_PREFIX);
  };
    /**
     * Converts an amount into a raw amount.
     *
     * @memberof BananoUtil
     * @param {string} amountStr the amount, as a string.
     * @param {string} amountPrefix the amount, as a string.
     * @return {string} the banano as a raw value.
     */
  const getRawStrFromNanoStr = (amountStr) => {
    return bananoUtil.getRawStrFromMajorAmountStr(amountStr, NANO_PREFIX);
  };

  /**
    * Converts an amount into a raw amount.
    *
    * @memberof BananoUtil
    * @param {string} amountStr the amount, as a string.
    * @param {string} amountPrefix the amount, as a string.
    * @return {string} the banano as a raw value.
    */
  const getRawStrFromNanoshiStr = (amountStr) => {
    return bananoUtil.getRawStrFromMinorAmountStr(amountStr, NANO_PREFIX);
  };

  /**
   * Get the banano account for a given public key.
   *
   * @memberof BananoUtil
   * @param {string} publicKey the public key.
   * @return {string} the account.
   */
  const getBananoAccount = (publicKey) => {
    return bananoUtil.getAccount(publicKey, BANANO_PREFIX);
  };

  /**
    * Get the banano account for a given public key.
    *
    * @memberof BananoUtil
    * @param {string} publicKey the public key.
    * @return {string} the account.
    */
  const getNanoAccount = (publicKey) => {
    return bananoUtil.getAccount(publicKey, NANO_PREFIX);
  };

  /**
   * Get the banano parts (banano, banoshi, raw) for a given raw value.
   *
   * @memberof BananoUtil
   * @param {string} amountRawStr the raw amount, as a string.
   * @return {BananoParts} the banano parts.
   */
  const getBananoPartsFromRaw = (amountRawStr) => {
    return bananoUtil.getAmountPartsFromRaw(amountRawStr, BANANO_PREFIX);
  };

  /**
    * Get the nano parts nano, nanoshi, raw) for a given raw value.
    *
    * @memberof BananoUtil
    * @param {string} amountRawStr the raw amount, as a string.
    * @return {BananoParts} the banano parts.
    */
  const getNanoPartsFromRaw = (amountRawStr) => {
    return bananoUtil.getAmountPartsFromRaw(amountRawStr, NANO_PREFIX);
  };


  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    // istanbul ignore if
    if (typeof BigInt === 'undefined') {
      return;
    }
    const exports = {};
    exports.BANANO_PREFIX = BANANO_PREFIX;
    exports.NANO_PREFIX = NANO_PREFIX;
    exports.PREFIXES = [BANANO_PREFIX, NANO_PREFIX];
    exports.sendNanoWithdrawalFromSeed = sendNanoWithdrawalFromSeed;
    exports.sendBananoWithdrawalFromSeed = sendBananoWithdrawalFromSeed;
    exports.getAccountsPending = getAccountsPending;
    exports.getBananoAccountFromSeed = getBananoAccountFromSeed;
    exports.getNanoAccountFromSeed = getNanoAccountFromSeed;
    exports.getAccountInfo = getAccountInfo;
    exports.getBlockCount = getBlockCount;

    exports.bananoUtil = bananoUtil;
    exports.bananodeApi = bananodeApi;
    exports.camoUtil = camoUtil;
    exports.depositUtil = depositUtil;
    exports.withdrawUtil = withdrawUtil;
    exports.loggingUtil = loggingUtil;
    exports.realBananodeApi = realBananodeApi;

    exports.setBananodeApi = setBananodeApi;
    exports.getBananoPartsFromDecimal = getBananoPartsFromDecimal;
    exports.getBananoPartsAsDecimal = getBananoPartsAsDecimal;
    exports.getBananoDecimalAmountAsRaw = getBananoDecimalAmountAsRaw;
    exports.getBananoPartsDescription = getBananoPartsDescription;
    exports.getAccountHistory = getAccountHistory;
    exports.openBananoAccountFromSeed = openBananoAccountFromSeed;
    exports.openNanoAccountFromSeed = openNanoAccountFromSeed;
    exports.getBlockHash = getBlockHash;
    exports.getAccountBalanceRaw = getAccountBalanceRaw;
    exports.getAccountBalanceAndPendingRaw = getAccountBalanceAndPendingRaw;
    exports.getBananoPartsFromRaw = getBananoPartsFromRaw;
    exports.getNanoPartsFromRaw = getNanoPartsFromRaw;
    exports.getPrivateKey = bananoUtil.getPrivateKey;
    exports.getPublicKey = bananoUtil.getPublicKey;
    exports.getAccount = bananoUtil.getAccount;
    exports.getNanoAccount = getNanoAccount;
    exports.getBananoAccount = getBananoAccount;
    exports.getAccountPublicKey = bananoUtil.getAccountPublicKey;
    exports.sendAmountToNanoAccount = sendAmountToNanoAccount;
    exports.sendAmountToBananoAccount = sendAmountToBananoAccount;
    exports.sendAmountToBananoAccountWithRepresentativeAndPrevious = sendAmountToBananoAccountWithRepresentativeAndPrevious;
    exports.sendAmountToNanoAccountWithRepresentativeAndPrevious = sendAmountToNanoAccountWithRepresentativeAndPrevious;
    exports.changeBananoRepresentativeForSeed = changeBananoRepresentativeForSeed;
    exports.changeNanoRepresentativeForSeed = changeNanoRepresentativeForSeed;
    exports.getSignature = getSignature;
    exports.signHash = signHash;
    exports.verify = verify;
    exports.getBytesFromHex = getBytesFromHex;
    exports.getWorkUsingCpu = getWorkUsingCpu;
    exports.getZeroedWorkBytes = bananoUtil.getZeroedWorkBytes;
    exports.isWorkValid = bananoUtil.isWorkValid;
    exports.getNanoAccountValidationInfo = bananoUtil.getNanoAccountValidationInfo;
    exports.getBananoAccountValidationInfo = bananoUtil.getBananoAccountValidationInfo;
    exports.receiveBananoDepositsForSeed = receiveBananoDepositsForSeed;
    exports.receiveNanoDepositsForSeed = receiveNanoDepositsForSeed;
    exports.getRawStrFromBananoStr = getRawStrFromBananoStr;
    exports.getRawStrFromBanoshiStr = getRawStrFromBanoshiStr;
    exports.getRawStrFromNanoStr = getRawStrFromNanoStr;
    exports.getRawStrFromNanoshiStr = getRawStrFromNanoshiStr;
    exports.setBananodeApiUrl = setBananodeApiUrl;
    exports.getCamoPublicKey = camoUtil.getCamoPublicKey;
    exports.getSharedSecret = camoUtil.getSharedSecret;
    exports.camoBananoReceive = camoBananoReceive;
    exports.camoNanoReceive = camoNanoReceive;
    exports.camoBananoSend = camoBananoSend;
    exports.camoNanoSend = camoNanoSend;
    exports.camoBananoSendWithdrawalFromSeed = camoBananoSendWithdrawalFromSeed;
    exports.camoNanoSendWithdrawalFromSeed = camoNanoSendWithdrawalFromSeed;
    exports.getCamoAccount = camoUtil.getCamoAccount;
    exports.getCamoBananoAccountBalanceRaw = getCamoBananoAccountBalanceRaw;
    exports.getCamoNanoAccountBalanceRaw = getCamoNanoAccountBalanceRaw;
    exports.getCamoBananoNextPrivateKeyForReceive = getCamoBananoNextPrivateKeyForReceive;
    exports.getCamoNanoNextPrivateKeyForReceive = getCamoNanoNextPrivateKeyForReceive;
    exports.camoBananoGetAccountsPending = camoBananoGetAccountsPending;
    exports.camoNanoGetAccountsPending = camoNanoGetAccountsPending;
    exports.getCamoBananoSharedAccountData = getCamoBananoSharedAccountData;
    exports.getCamoNanoSharedAccountData = getCamoNanoSharedAccountData;
    exports.receiveCamoBananoDepositsForSeed = receiveCamoBananoDepositsForSeed;
    exports.receiveCamoNanoDepositsForSeed = receiveCamoNanoDepositsForSeed;
    exports.getCamoAccountValidationInfo = getCamoAccountValidationInfo;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.bananocoinBananojs = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
