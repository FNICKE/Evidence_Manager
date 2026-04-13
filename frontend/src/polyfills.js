/* eslint-disable no-undef */
// robust browser polyfills for IPFS and other dependencies
const TE = class TextEncoder {
    encode(str) { return new Uint8Array(str.split("").map(c => c.charCodeAt(0))); }
};
const TD = class TextDecoder {
    decode(arr) { return String.fromCharCode.apply(null, arr); }
};

if (!window.TextEncoder) window.TextEncoder = TE;
if (!window.TextDecoder) window.TextDecoder = TD;

const globalT = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

if (!globalT.TextEncoder) globalT.TextEncoder = TE;
if (!globalT.TextDecoder) globalT.TextDecoder = TD;

if (!window.Buffer) {
  window.Buffer = require('buffer').Buffer;
}
