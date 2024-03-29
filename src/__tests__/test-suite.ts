import {expect} from '@loopback/testlab';
import util from 'util';
import iconv from 'iconv-lite';

import {BaseMutableBuffer} from '../mbuf';
import {Buffer} from 'buffer';

export function testMutableBuffer(MutableBuffer: typeof BaseMutableBuffer) {
  function spit(actual: any, expected: any, message?: string) {
    console.log('');
    if (message) console.log(message);
    console.log('actual ' + util.inspect(actual));
    console.log('expect ' + util.inspect(expected));
    console.log('');
  }

  function assertBuffers(actual: any, expected: any, message?: string) {
    if (actual.length !== expected.length) {
      spit(actual, expected, message);
      expect(actual.length).equal(expected.length);
    }
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) {
        spit(actual, expected, message);
      }
      expect(actual[i]).equal(expected[i]);
    }
  }

  function itWriteFixedNumber(type: string, val: any, expected: any) {
    const fn = 'write' + type;

    it(fn + '(' + val + ')', function () {
      const mb = new MutableBuffer();
      (<any>mb)[fn](val);
      const result = mb.render();
      assertBuffers(result, expected, fn);
    });
  }

  function itWriteLengthNumber(type: string, val: any, length: number, expected: any) {
    const fn = 'write' + type;

    it(fn + '(' + val + ')', function () {
      const mb = new MutableBuffer();
      (<any>mb)[fn](val, length);
      const result = mb.render();
      assertBuffers(result, expected, fn);
    });
  }

  describe('main functions', function () {
    describe('writing number', function () {
      itWriteFixedNumber('UInt8', 0, [0]);
      itWriteFixedNumber('UInt8', 255, [255]);

      itWriteFixedNumber('UInt16BE', 256, [1, 0]);
      itWriteFixedNumber('UInt16LE', 256, [0, 1]);

      itWriteFixedNumber('UInt32BE', 256, [0, 0, 1, 0]);
      itWriteFixedNumber('UInt32LE', 256, [0, 1, 0, 0]);

      itWriteFixedNumber('Int8', 0, [0]);
      itWriteFixedNumber('Int8', 127, [127]);
      itWriteFixedNumber('Int8', -126, [256 - 126]);

      itWriteFixedNumber('Int16BE', 256, [1, 0]);
      itWriteFixedNumber('Int16LE', 256, [0, 1]);
      itWriteFixedNumber('Int16BE', -256, [0xff, 0]);
      itWriteFixedNumber('Int16LE', -256, [0, 0xff]);

      itWriteFixedNumber('Int32BE', 256, [0, 0, 1, 0]);
      itWriteFixedNumber('Int32LE', 256, [0, 1, 0, 0]);
      itWriteFixedNumber('Int32BE', -256, [0xff, 0xff, 0xff, 0]);
      itWriteFixedNumber('Int32LE', -256, [0, 0xff, 0xff, 0xff]);

      itWriteFixedNumber('FloatBE', 0xcafebabe, [0x4f, 0x4a, 0xfe, 0xbb]);
      itWriteFixedNumber('FloatLE', 0xcafebabe, [0xbb, 0xfe, 0x4a, 0x4f]);

      itWriteFixedNumber('DoubleBE', 0x1234567890abcdef, [0x43, 0xb2, 0x34, 0x56, 0x78, 0x90, 0xab, 0xce]);
      itWriteFixedNumber('DoubleLE', 0x1234567890abcdef, [0xce, 0xab, 0x90, 0x78, 0x56, 0x34, 0xb2, 0x43]);

      itWriteLengthNumber('UIntBE', 0x1234567890ab, 6, [0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);
      itWriteLengthNumber('UIntLE', 0x1234567890ab, 6, [0xab, 0x90, 0x78, 0x56, 0x34, 0x12]);

      itWriteLengthNumber('IntBE', -0x1234567890ab, 6, [0xed, 0xcb, 0xa9, 0x87, 0x6f, 0x55]);
      itWriteLengthNumber('IntLE', -0x1234567890ab, 6, [0x55, 0x6f, 0x87, 0xa9, 0xcb, 0xed]);

      it('writing multiple number', function () {
        const mb = new MutableBuffer();
        mb.writeUInt32BE(1);
        mb.writeUInt32BE(10);
        mb.writeUInt32BE(0);
        expect(mb.size).equal(12);
        assertBuffers(mb.render(), [0, 0, 0, 1, 0, 0, 0, 0x0a, 0, 0, 0, 0]);
      });
    });

    describe('having to resize the buffer', function () {
      it('after resize correct result returned', function () {
        const mb = new MutableBuffer(10, 10);
        mb.writeUInt32BE(1);
        mb.writeUInt32BE(1);
        mb.writeUInt32BE(1);
        expect(mb.size).equal(12);
        expect(mb.capacity()).equal(20);
        assertBuffers(mb.render(), [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
      });
    });

    describe('CString', function () {
      it('writes empty cstring', function () {
        const mb = new MutableBuffer();
        mb.writeCString();
        const result = mb.render();
        assertBuffers(result, [0]);
      });

      it('writes two empty cstrings', function () {
        const mb = new MutableBuffer();
        mb.writeCString('');
        mb.writeCString('');
        const result = mb.render();
        assertBuffers(result, [0, 0]);
      });

      it('writes non-empty cstring', function () {
        const mb = new MutableBuffer();
        mb.writeCString('!!!');
        const result = mb.render();
        assertBuffers(result, [33, 33, 33, 0]);
      });

      it('resizes if reached end', function () {
        const mb = new MutableBuffer(3);
        mb.writeCString('!!!');
        const result = mb.render();
        assertBuffers(result, [33, 33, 33, 0]);
      });

      it('writes multiple cstrings', function () {
        const mb = new MutableBuffer();
        mb.writeCString('!');
        mb.writeCString('!');
        const result = mb.render();
        assertBuffers(result, [33, 0, 33, 0]);
      });
    });

    it('writes char', function () {
      const mb = new MutableBuffer(2);
      mb.writeChar('a');
      mb.writeChar('b');
      mb.writeChar('c');
      const result = mb.render();
      assertBuffers(result, [0x61, 0x62, 0x63]);
    });

    it('gets correct size', function () {
      const mb = new MutableBuffer(5);
      expect(mb.size).equal(0);
      mb.writeInt32BE(0);
      expect(mb.size).equal(4);
      mb.writeCString('!');
      expect(mb.size).equal(6);
    });

    it('can write arbitrary buffer to the end', function () {
      const mb = new MutableBuffer(4);
      mb.writeCString('!!!');
      mb.write(Buffer.from('@@@'));
      const result = mb.render();
      assertBuffers(result, [33, 33, 33, 0, 0x40, 0x40, 0x40]);
    });

    describe('can write normal string', function () {
      const mb = new MutableBuffer(4);
      mb.write('!');
      let result = mb.render();
      assertBuffers(result, [33]);
      it('can write cString too', function () {
        mb.writeCString('!');
        result = mb.render();
        assertBuffers(result, [33, 33, 0]);
      });
      it('can resize', function () {
        mb.write('!!');
        result = mb.render();
        assertBuffers(result, [33, 33, 0, 33, 33]);
      });
    });

    describe('can write custom encoding string', function () {
      it('can write utf8 string', function () {
        const mb = new MutableBuffer();
        mb.write('你好');
        const result = mb.render();
        assertBuffers(result, [0xe4, 0xbd, 0xa0, 0xe5, 0xa5, 0xbd]);
      });

      it('can write gbk buffer string', function () {
        const mb = new MutableBuffer();
        mb.write(iconv.encode('你好', 'gbk'));
        const result = mb.render();
        assertBuffers(result, [0xc4, 0xe3, 0xba, 0xc3]);
      });

      it('can write gbk buffer CString', function () {
        const mb = new MutableBuffer();
        mb.writeCString(iconv.encode('你好', 'gbk'));
        const result = mb.render();
        assertBuffers(result, [0xc4, 0xe3, 0xba, 0xc3, 0x00]);
      });
    });

    describe('write array', function () {
      it('can write binary array', function () {
        const data = [0x01, 0x02];
        const mb = new MutableBuffer();
        mb.write(data);
        const result = mb.render();
        assertBuffers(result, data);
      });
    });

    describe('write mutable buffer', function () {
      it('can write from another mutable buffer', function () {
        const data = [0x01, 0x02];
        const mb = new MutableBuffer();
        const source = new MutableBuffer();
        source.write(data);
        mb.write(source);
        const result = mb.render();
        assertBuffers(result, data);
      });
    });

    describe('rendering', function () {
      it('rendering in zero copy', function () {
        const data1 = [0x01, 0x02];
        const data2 = [0x99, 0x99];
        const mb = new MutableBuffer();
        mb.write(data1);
        const rendered = mb.render();
        assertBuffers(rendered, data1);
        mb.clear();
        mb.write(data2);
        assertBuffers(rendered, data2);
      });

      it('rendering in full copy', function () {
        const data1 = [0x01, 0x02];
        const data2 = [0x99, 0x99];
        const mb = new MutableBuffer();
        mb.write(data1);
        const rendered = mb.render(true);
        assertBuffers(rendered, data1);
        mb.clear();
        mb.write(data2);
        assertBuffers(rendered, data1);
      });

      it('rendering with buffer provided', function () {
        const data1 = [0x01, 0x02];
        const data2 = [0x99, 0x99];
        const buffer = Buffer.alloc(data1.length);
        const mb = new MutableBuffer();
        mb.write(data1);
        const rendered = mb.render(buffer);
        expect(rendered).equal(buffer);
        assertBuffers(rendered, data1);
        mb.clear();
        mb.write(data2);
        assertBuffers(rendered, data1);
      });
    });

    describe('clearing', function () {
      const mb = new MutableBuffer();
      mb.writeCString('@!!#!#');
      mb.writeInt32BE(10401);
      it('clears', function () {
        mb.clear();
        assertBuffers(mb.render(), []);
      });
      it('writing more', function () {
        mb.writeCString('!');
        mb.writeInt32BE(9);
        mb.writeInt16BE(2);
        const rendered = mb.render();
        assertBuffers(rendered, [33, 0, 0, 0, 0, 9, 0, 2]);
      });
      it('returns result', function () {
        const flushedResult = mb.flush();
        assertBuffers(flushedResult, [33, 0, 0, 0, 0, 9, 0, 2]);
      });
      it('clears the writer', function () {
        assertBuffers(mb.render(), []);
        assertBuffers(mb.flush(), []);
      });
    });

    it('resizing to much larger', function () {
      const mb = new MutableBuffer(2);
      const string = '!!!!!!!!';
      mb.writeCString(string);
      const result = mb.flush();
      assertBuffers(result, [33, 33, 33, 33, 33, 33, 33, 33, 0]);
    });

    describe('flush', function () {
      it('flush a full buffer', function () {
        const mb = new MutableBuffer(1);
        mb.writeCString('!');
        const result = mb.flush();
        assertBuffers(result, [33, 0]);
        expect(mb.size).equal(0);
      });

      it('flush a non-full buffer', function () {
        const mb = new MutableBuffer(10);
        mb.writeCString('!');
        const rendered = mb.render();
        const result = mb.flush();
        assertBuffers(result, [33, 0]);
        assertBuffers(result, rendered);
        expect(mb.size).equal(0);
      });

      it('flush a buffer which requires resizing', function () {
        const mb = new MutableBuffer(2);
        mb.writeCString('!!!!!!!!');
        const result = mb.flush();
        assertBuffers(result, [33, 33, 33, 33, 33, 33, 33, 33, 0]);
      });
    });

    describe('native buffer', function () {
      it('should return native buffer instance', function () {
        const mb = new MutableBuffer();
        expect(mb.nativeBuffer).instanceOf(MutableBuffer.Buffer);
      });
    });

    describe('trim', function () {
      function testTrim(
        description: string,
        sample: number[],
        expected: {
          trim: number[];
          trimLeft: number[];
          trimRight: number[];
        },
      ) {
        describe(description, function () {
          it('should trim', function () {
            const mb = new MutableBuffer();
            mb.write(sample);
            mb.trim();
            expect(mb.size).equal(expected.trim.length);
            assertBuffers(mb.flush(), expected.trim);
          });

          it('should trim right', function () {
            const mb = new MutableBuffer();
            mb.write(sample);
            mb.trimLeft();
            expect(mb.size).equal(expected.trimLeft.length);
            assertBuffers(mb.flush(), expected.trimLeft);
          });

          it('should trim both left and right', function () {
            const mb = new MutableBuffer();
            mb.write(sample);
            mb.trimRight();
            expect(mb.size).equal(expected.trimRight.length);
            assertBuffers(mb.flush(), expected.trimRight);
          });
        });
      }

      testTrim('both start and end have 0', [0x00, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00], {
        trim: [0x01, 0x02],
        trimLeft: [0x01, 0x02, 0x00, 0x00, 0x00],
        trimRight: [0x00, 0x00, 0x01, 0x02],
      });

      testTrim('only start have 0', [0x00, 0x00, 0x01, 0x02], {
        trim: [0x01, 0x02],
        trimLeft: [0x01, 0x02],
        trimRight: [0x00, 0x00, 0x01, 0x02],
      });

      testTrim('only end have 0', [0x01, 0x02, 0x00, 0x00, 0x00], {
        trim: [0x01, 0x02],
        trimLeft: [0x01, 0x02, 0x00, 0x00, 0x00],
        trimRight: [0x01, 0x02],
      });

      testTrim('both start and end have not 0', [0x01, 0x02], {
        trim: [0x01, 0x02],
        trimLeft: [0x01, 0x02],
        trimRight: [0x01, 0x02],
      });

      testTrim('only have 0', [0x00, 0x00], {
        trim: [],
        trimLeft: [],
        trimRight: [],
      });

      testTrim('empty', [], {
        trim: [],
        trimLeft: [],
        trimRight: [],
      });
    });
  });
}
