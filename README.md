# mutable-buffer

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![Coverage percentage][coveralls-image]][coveralls-url]

> A mutable buffer library for node.js

## Install

```sh
$ npm install --save mutable-buffer
```

## Usage

```js
const { MutableBuffer } = require('mutable-buffer');

const buffer = new MutableBuffer(/* initialSize, blockSize */);

// use it like node Buffer
buffer.writeUInt8(8);
buffer.writeUInt16LE(0x1234);

buffer.write('hello');
buffer.write(otherBuffer);

// write a string to the buffer utf8 encoded and adds a null character (\0) at the end.
buffer.writeCString('hello');

// write a char
buffer.writeChar('a');

// get size of mutable buffer
buffer.size();

// get current capacity of mutable buffer
buffer.capacity();

// return a sliced Buffer instance
result = buffer.join();

// or return a sliced Buffer instance and clear buffer
result = buffer.flush();

// clear manual
buffer.clear();
```

## License

MIT © [taoyuan](https://github.com/taoyuan)

[npm-image]: https://badge.fury.io/js/mutable-buffer.svg
[npm-url]: https://npmjs.org/package/mutable-buffer
[travis-image]: https://travis-ci.org/taoyuan/mutable-buffer.svg?branch=master
[travis-url]: https://travis-ci.org/taoyuan/mutable-buffer
[coveralls-image]: https://coveralls.io/repos/taoyuan/mutable-buffer/badge.svg
[coveralls-url]: https://coveralls.io/r/taoyuan/mutable-buffer
