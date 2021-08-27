import {expect} from '@loopback/testlab';
import {testMutableBuffer} from './test-suite';
import {MutableBuffer} from '../browser';

describe('mutable-buffer/browser', function () {
  it('should have browser flag', function () {
    expect(MutableBuffer.target).equal('web');
  });

  it('should create mutable buffer with static create function', function () {
    expect(MutableBuffer.create()).instanceOf(MutableBuffer);
  });

  testMutableBuffer(MutableBuffer);
});
