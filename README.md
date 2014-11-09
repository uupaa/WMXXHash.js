# WMXXHash.js [![Build Status](https://travis-ci.org/uupaa/WMXXHash.js.png)](http://travis-ci.org/uupaa/WMXXHash.js)

[![npm](https://nodei.co/npm/uupaa.wmxxhash.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.wmxxhash.js/)

xxhash function.

WMXXHash.js is a fork from [xxhash](https://code.google.com/p/xxhash/) (xxhash.c rev38)

## Document

- [WMXXHash.js wiki](https://github.com/uupaa/WMXXHash.js/wiki/WMXXHash)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## How to use

### Browser

```js
<script src="lib/WMXXHash.js"></script>
<script>
var source = new Uint8Array([97, 98, 99, 100]); // eq "abcd"
var seed = 0xabcd;

console.log( WMXXHash(source, seed).toString(16) ); // cda8fae4
</script>
```

### WebWorkers

```js
importScripts("lib/WMXXHash.js");

...
```

### Node.js

```js
var WMXXHash = require("lib/WMXXHash.js");

...
```
