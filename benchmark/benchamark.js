const benchmark = require('benchmark');
const randomString = require('random-string');
const {MutableBuffer} = require('..');

function run() {
  const d1 = randomString(800);
  const d2 = randomString(800);

  const pooled = new MutableBuffer();

  const suite = new benchmark.Suite('Buffer Join')
    .add('Buffer.concat', () => {
      const b1 = Buffer.allocUnsafe(1024);
      b1.write(d1);
      const b2 = Buffer.allocUnsafe(1024);
      b2.write(d2);
      Buffer.concat([b1, b2]);
    })
    .add('Buffer.copy', () => {
      const b1 = Buffer.allocUnsafe(1024);
      b1.write(d1);
      const b2 = Buffer.allocUnsafe(1024);
      b2.write(d2);
      const answer = Buffer.allocUnsafe(b1.length + b2.length);
      const pos = answer.copy(b1);
      answer.copy(b2, pos);
    })
    .add('MutableBuffer.flush()', () => {
      const mb = new MutableBuffer();
      mb.write(d1);
      mb.write(d2);
      mb.flush();
    })
    .add('MutableBuffer.flush(true)', () => {
      const mb = new MutableBuffer();
      mb.write(d1);
      mb.write(d2);
      mb.flush(true);
    })
    .add('MutableBuffer.flush() /reuse', () => {
      pooled.write(d1).write(d2);
      pooled.flush(true);
    })
    .add('MutableBuffer.flush(true) /reuse', () => {
      pooled.write(d1).write(d2);
      pooled.flush(true);
    })
    .on('cycle', function (event) {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('Fastest is ' + suite.filter('fastest').map('name'));
    })
    .run({async: false});
}

run();
