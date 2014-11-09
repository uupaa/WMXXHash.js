(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

var PRIME32_1 = 2654435761;
var PRIME32_2 = 2246822519;
var PRIME32_3 = 3266489917;
var PRIME32_4 =  668265263;
var PRIME32_5 =  374761393;

// --- class / interfaces ----------------------------------
function WMXXHash(source, // @arg Uint8Array
                  seed) { // @arg Integer = 0 - seed
                          // @ret Uint32
//{@dev
    $valid($type(source, "Uint8Array"),   WMXXHash, "source");
    $valid($type(seed,   "Integer|omit"), WMXXHash, "seed");
//}@dev

    return _createHash(source, source.length, seed || 0);
}

//{@dev
WMXXHash["repository"] = "https://github.com/uupaa/WMXXHash.js"; // GitHub repository URL. http://git.io/Help
//}@dev

// --- implements ------------------------------------------
function _createHash(input,  // @arg Uint8Array
                     len,    // @arg Integer - input length
                     seed) { // @arg Uint32
                             // @ret Uint32 - xxHash result
    var Math_imul = Math["imul"] || es6_polyfill_math_imul;

    var p = 0;
    var bEnd = p + len;
    var v = new Uint32Array(5); // v[0] aka h32

    // bulk loop (unit: 16bytes)
    if (len >= 16) {
        var limit = bEnd - 16;

        v[1] = seed + PRIME32_1 + PRIME32_2; // aka v1
        v[2] = seed + PRIME32_2;             // aka v2
        v[3] = seed + 0;                     // aka v3
        v[4] = seed - PRIME32_1;             // aka v4

        do {
            v[1] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[1]  = XXH_rotl32(v[1], 13);
            v[1]  = Math_imul(v[1], PRIME32_1);
            p += 4;

            v[2] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[2]  = XXH_rotl32(v[2], 13);
            v[2]  = Math_imul(v[2], PRIME32_1);
            p += 4;

            v[3] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[3]  = XXH_rotl32(v[3], 13);
            v[3]  = Math_imul(v[3], PRIME32_1);
            p += 4;

            v[4] += Math_imul(XXH_get32bits(input, p), PRIME32_2);
            v[4]  = XXH_rotl32(v[4], 13);
            v[4]  = Math_imul(v[4], PRIME32_1);
            p += 4;
        }
        while (p <= limit);

        v[0] = XXH_rotl32(v[1], 1)  + XXH_rotl32(v[2], 7) +
               XXH_rotl32(v[3], 12) + XXH_rotl32(v[4], 18);
    } else {
        v[0] = seed + PRIME32_5;
    }

    v[0] += len;

    // bulk loop (unit: 4bytes)
    while (p + 4 <= bEnd) {
        v[0] += Math_imul(XXH_get32bits(input, p), PRIME32_3);
        v[0]  = Math_imul(XXH_rotl32(v[0], 17), PRIME32_4);
        p += 4;
    }

    // remain loop (unit: 1byte)
    while (p < bEnd) {
        v[0] += Math_imul(input[p], PRIME32_5);
        v[0]  = Math_imul(XXH_rotl32(v[0], 11), PRIME32_1);
        p++;
    }

    v[0] ^= v[0] >>> 15;
    v[0]  = Math_imul(v[0], PRIME32_2);
    v[0] ^= v[0] >>> 13;
    v[0]  = Math_imul(v[0], PRIME32_3);
    v[0] ^= v[0] >>> 16;

    return v[0];
}

function XXH_get32bits(source, // @arg Uint8Array
                       p) {    // @arg Integer - pointer(source index)
    return (source[p + 3] << 24) | (source[p + 2] << 16) |
           (source[p + 1] <<  8) |  source[p];
}

function XXH_rotl32(x,   // @arg Uint32  - value
                    r) { // @arg Uint8   - bit shift value (0 - 31)
                         // @ret Integer
    return (x << r) | (x >>> (32 - r));
}

//{@es6_polyfill
function es6_polyfill_math_imul(a,   // @arg Uint32|Uint64 - value a
                                b) { // @arg Uint32|Uint64 - value b
                                     // @ret Uint32 - the C-like 32-bit multiplication of the two parameters.
  var a_high = (a >>> 16) & 0xffff;
  var a_low  =  a         & 0xffff;
  var b_high = (b >>> 16) & 0xffff;
  var b_low  =  b         & 0xffff;

  return ((a_low * b_low) + (((a_high * b_low + a_low * b_high) << 16) >>> 0)|0);
}
//}@es6_polyfill

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = WMXXHash;
}
global["WMXXHash" in global ? "WMXXHash_" : "WMXXHash"] = WMXXHash; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

