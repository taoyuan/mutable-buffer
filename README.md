# mutable-buffer

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![Coverage percentage][coveralls-image]][coveralls-url]

> A mutable buffer library for both node.js and browser

## Install

```sh
$ npm install mutable-buffer
```

## Usage

### Basic usage

```js
const {MutableBuffer} = require('mutable-buffer');

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
result = buffer.render();

// return a fresh Buffer instance
result = buffer.render(true);

// or return a sliced Buffer instance and clear buffer
result = buffer.flush();

// or return a fresh Buffer instance and clear buffer
result = buffer.flush(true);

// clear manual
buffer.clear();
```

### Trim null characters

```js
const {MutableBuffer} = require('mutable-buffer');

const buffer = new MutableBuffer(/* initialSize, blockSize */);

// trimLeft
buffer.write([0x00, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00]);
buffer.trimLeft().flush(); // => [0x01, 0x02, 0x00, 0x00, 0x00]

// trimRight
buffer.write([0x00, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00]);
buffer.trimRight().flush(); // => [0x00, 0x00, 0x01, 0x02]

// trim
buffer.write([0x00, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00]);
buffer.trim().flush(); // => [0x01, 0x02]
```

## Use in browser

`mutable-buffer` introduced [feross/buffer](https://github.com/feross/buffer) to support for the browser out of box in
`v3.0`.

A front-end packaging tool like `webpack` will recognize the `browser` entry defined in `pacakge.json` and use the
browser version of `mutable-buffer` by default.

You can print `MutableBuffer.target` to confirm that.

```js
// in node
console.log(MutableBuffer.target); // => 'node'

// in browser
console.log(MutableBuffer.target); // => 'web'
```

## License

MIT © [taoyuan](https://github.com/taoyuan)

[npm-image]: https://badge.fury.io/js/mutable-buffer.svg
[npm-url]: https://npmjs.org/package/mutable-buffer
[travis-image]: https://travis-ci.org/taoyuan/mutable-buffer.svg?branch=master
[travis-url]: https://travis-ci.org/taoyuan/mutable-buffer
[coveralls-image]: https://coveralls.io/repos/taoyuan/mutable-buffer/badge.svg
[coveralls-url]: https://coveralls.io/r/taoyuan/mutable-buffer
