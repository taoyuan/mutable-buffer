'use strict';

var DEFAULT_INITIAL_SIZE = 1024;
var DEFAULT_BLOCK_SIZE = 1024;

module.exports = MutableBuffer;

function MutableBuffer(size, blockSize) {
  if (!(this instanceof MutableBuffer)) {
    return new MutableBuffer(size, blockSize);
  }
  this._initialSize = size || DEFAULT_INITIAL_SIZE;
  this._blockSize = blockSize || DEFAULT_BLOCK_SIZE;

  this._buffer = new Buffer(this._initialSize);
  this._size = 0;
}

Object.defineProperty(MutableBuffer.prototype, 'size', {
  get: function () {
    return this._size;
  }
});

Object.defineProperty(MutableBuffer.prototype, 'buffer', {
  get: function () {
    return this._buffer;
  }
});

Object.defineProperty(MutableBuffer.prototype, 'nativeBuffer', {
  get: function () {
    return this._buffer;
  }
});

//resize internal buffer if not enough size left
MutableBuffer.prototype._ensure = function (size) {
  var remaining = this._buffer.length - this._size;
  if (remaining < size) {
    var factor = Math.ceil((size - remaining) / this._blockSize);

    var oldBuffer = this._buffer;
    this._buffer = new Buffer(oldBuffer.length + this._blockSize * factor);
    oldBuffer.copy(this._buffer);
  }
};

MutableBuffer.prototype.capacity = function () {
  return this._buffer.length;
};

MutableBuffer.prototype.clear = function () {
  this._size = 0;
};

MutableBuffer.prototype.join = function () {
  return this._buffer.slice(0, this._size);
};

MutableBuffer.prototype.flush = function () {
  var result = this.join();
  this.clear();
  return result;
};

MutableBuffer.prototype.write = function (data, encoding) {
  if (Buffer.isBuffer(data)) {
    this._ensure(data.length);
    data.copy(this._buffer, this._size);
    this._size += data.length;
  } else if (Array.isArray(data)) {
    this._ensure(data.length);
    for (var i = 0; i < data.length; i++) {
      this._buffer[this._size + i] = data[i];
    }
    this._size += data.length;
  } else if (data && data.buffer && data.size) {
    this._ensure(data.size);
    data.buffer.copy(this._buffer, this._size);
    this._size += data.size;
  } else {
    data = data + '';
    var len = Buffer.byteLength(data, encoding);
    this._ensure(len);
    this._buffer.write(data, this._size, encoding);
    this._size += len;
  }
  return this;
};

MutableBuffer.prototype.writeCString = function (data, encoding) {
  //just write a 0 for empty or null strings
  if (!data) {
    this._ensure(1);
  } else if (Buffer.isBuffer(data)) {
    this._ensure(data.length);
    data.copy(this._buffer, this._size);
    this._size += data.length;
  } else {
    var len = Buffer.byteLength(data, encoding);
    this._ensure(len + 1); //+1 for null terminator
    this._buffer.write(data, this._size, len, encoding);
    this._size += len;
  }

  this._buffer[this._size++] = 0; // null terminator
  return this;
};

MutableBuffer.prototype.writeChar = function (c) {
  this._ensure(1);
  this._buffer.write(c, this._size, 1);
  this._size++;
  return this;
};

MutableBuffer.prototype.writeUIntLE = function (value, byteLength, noAssert) {
  this._ensure(byteLength >>> 0);
  this._size = this._buffer.writeUIntLE(value, this._size, byteLength, noAssert);
  return this;
};


MutableBuffer.prototype.writeUIntBE = function (value, byteLength, noAssert) {
  this._ensure(byteLength >>> 0);
  this._size = this._buffer.writeUIntBE(value, this._size, byteLength, noAssert);
  return this;
};


MutableBuffer.prototype.writeUInt8 = function (value, noAssert) {
  this._ensure(1);
  this._size = this._buffer.writeUInt8(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeUInt16LE = function (value, noAssert) {
  this._ensure(2);
  this._size = this._buffer.writeUInt16LE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeUInt16BE = function (value, noAssert) {
  this._ensure(2);
  this._size = this._buffer.writeUInt16BE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeUInt32LE = function (value, noAssert) {
  this._ensure(4);
  this._size = this._buffer.writeUInt32LE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeUInt32BE = function (value, noAssert) {
  this._ensure(4);
  this._size = this._buffer.writeUInt32BE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeIntLE = function (value, byteLength, noAssert) {
  this._ensure(byteLength >>> 0);
  this._size = this._buffer.writeIntLE(value, this._size, byteLength, noAssert);
  return this;
};


MutableBuffer.prototype.writeIntBE = function (value, byteLength, noAssert) {
  this._ensure(byteLength >>> 0);
  this._size = this._buffer.writeIntBE(value, this._size, byteLength, noAssert);
  return this;
};


MutableBuffer.prototype.writeInt8 = function (value, noAssert) {
  this._ensure(1);
  this._size = this._buffer.writeInt8(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeInt16LE = function (value, noAssert) {
  this._ensure(2);
  this._size = this._buffer.writeInt16LE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeInt16BE = function (value, noAssert) {
  this._ensure(2);
  this._size = this._buffer.writeInt16BE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeInt32LE = function (value, noAssert) {
  this._ensure(4);
  this._size = this._buffer.writeInt32LE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeInt32BE = function (value, noAssert) {
  this._ensure(4);
  this._size = this._buffer.writeInt32BE(value, this._size, noAssert);
  return this;
};

MutableBuffer.prototype.writeFloatLE = function writeFloatLE(value, noAssert) {
  this._ensure(4);
  this._size = this._buffer.writeFloatLE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeFloatBE = function writeFloatBE(value, noAssert) {
  this._ensure(4);
  this._size = this._buffer.writeFloatBE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeDoubleLE = function writeDoubleLE(value, noAssert) {
  this._ensure(8);
  this._size = this._buffer.writeDoubleLE(value, this._size, noAssert);
  return this;
};


MutableBuffer.prototype.writeDoubleBE = function writeDoubleBE(value, noAssert) {
  this._ensure(8);
  this._size = this._buffer.writeDoubleBE(value, this._size, noAssert);
  return this;
};
