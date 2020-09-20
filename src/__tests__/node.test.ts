import {expect} from '@tib/testlab';
import {testMutableBuffer} from './test-suite';
import {MutableBuffer} from '../node';

describe('mutable-buffer/node', function () {
  it('should have node flag', function () {
    expect(MutableBuffer.target).equal('node');
  });

  it('should create mutable buffer with static create function', function () {
    expect(MutableBuffer.create()).instanceOf(MutableBuffer);
  });

  testMutableBuffer(MutableBuffer);
});
