var ModuleTestWMXXHash = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

return new Test("WMXXHash", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        testWMXXHash,
    ]).run().clone();

// see https://gist.github.com/uupaa/8609d8d2d4ee6876eac1
//
//    printf("%x\n", XXH32("",             0, 0));      //  2cc5d05
//    printf("%x\n", XXH32("a",            1, 0));      // 550d7456
//    printf("%x\n", XXH32("ab",           2, 0));      // 4999fc53
//    printf("%x\n", XXH32("abc",          3, 0));      // 32d153ff
//    printf("%x\n", XXH32("abcd",         4, 0));      // a3643705
//    printf("%x\n", XXH32("abcd",         4, 0xabcd)); // cda8fae4
//    printf("%x\n", XXH32("abcde",        5, 0));      // 9738f19b
//    printf("%x\n", XXH32("abcdef",       6, 0));      // 8b7cd587
//    printf("%x\n", XXH32("abcdefg",      7, 0));      // 9dd093b3
//    printf("%x\n", XXH32("abcdefgh",     8, 0));      //  bb3c6bb
//    printf("%x\n", XXH32("abcdefghi",    9, 0));      // d03c13fd
//    printf("%x\n", XXH32("abcdefghij",  10, 0));      // 8b988cfe
//    printf("%x\n", XXH32("abcdefghijk", 11, 0));      // 9db8a215
//    printf("%x\n", XXH32("abcdefghijk", 11, 123));    // 69659438
//    printf("%x\n", XXH32("0123456789abcdef", 16, 0)); // c2c45b69
//    printf("%x\n", XXH32("0123456789abcdef0",17, 0)); // aa9118bd
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef", 32, 0)); // eb888d30
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef0",33, 0)); // 5c28f38d
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef", 64, 0)); // e717e5fb
//    printf("%x\n", XXH32("0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef"
//                         "0123456789abcdef", 64, 64)); // 1198f54


function testWMXXHash(test, pass, miss) {

    var source = {
            length_0:  "",
            length_1:  "a",
            length_2:  "ab",
            length_3:  "abc",
            length_4:  "abcd",
            length_5:  "abcde",
            length_6:  "abcdef",
            length_7:  "abcdefg",
            length_8:  "abcdefgh",
            length_9:  "abcdefghi",
            length_10: "abcdefghij",
            length_11: "abcdefghijk",
            length_16: "0123456789abcdef",
            length_17: "0123456789abcdef0",
            length_32: "0123456789abcdef" +
                       "0123456789abcdef",
            length_33: "0123456789abcdef" +
                       "0123456789abcdef0",
            length_64: "0123456789abcdef" +
                       "0123456789abcdef" +
                       "0123456789abcdef" +
                       "0123456789abcdef",
            bigArray: createBigArray(1024 * 100)
        };

    var result = [
            WMXXHash(toUint8Array(source.length_0))         === 0x02cc5d05,
            WMXXHash(toUint8Array(source.length_1))         === 0x550d7456,
            WMXXHash(toUint8Array(source.length_2))         === 0x4999fc53,
            WMXXHash(toUint8Array(source.length_3))         === 0x32d153ff,
            WMXXHash(toUint8Array(source.length_4))         === 0xa3643705,
            WMXXHash(toUint8Array(source.length_4), 0xabcd) === 0xcda8fae4,
            WMXXHash(toUint8Array(source.length_5))         === 0x9738f19b,
            WMXXHash(toUint8Array(source.length_6))         === 0x8b7cd587,
            WMXXHash(toUint8Array(source.length_7))         === 0x9dd093b3,
            WMXXHash(toUint8Array(source.length_8))         === 0x0bb3c6bb,
            WMXXHash(toUint8Array(source.length_9))         === 0xd03c13fd,
            WMXXHash(toUint8Array(source.length_10))        === 0x8b988cfe,
            WMXXHash(toUint8Array(source.length_11))        === 0x9db8a215,
            WMXXHash(toUint8Array(source.length_11), 123)   === 0x69659438,
            WMXXHash(toUint8Array(source.length_16))        === 0xc2c45b69,
            WMXXHash(toUint8Array(source.length_17))        === 0xaa9118bd,
            WMXXHash(toUint8Array(source.length_32))        === 0xeb888d30,
            WMXXHash(toUint8Array(source.length_33))        === 0x5c28f38d,
            WMXXHash(toUint8Array(source.length_64))        === 0xe717e5fb,
            WMXXHash(toUint8Array(source.length_64), 64)    === 0x01198f54,
            WMXXHash(source.bigArray)                       === 0xc419ee19,
        ];

    if (!/false/.test(result.join(","))) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function toUint8Array(source) { // @arg ASCIIString
                                // @ret Uint8Array
    var charArray = source.split("").map(function(_) {
                        return _.charCodeAt(0) & 0xff;
                    });

    return new Uint8Array(charArray);
}

function createBigArray(length) {
    var result = new Uint8Array(length);

    for (var i = 0; i < length; ++i) {
        result[i] = i;
    }
    return result;
}

})((this || 0).self || global);

