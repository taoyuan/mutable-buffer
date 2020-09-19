import {expect} from '@tib/testlab';
import {Buffer} from 'buffer/';
import {Buffer as BufferType} from '../buffer-browser';

describe('buffer', function () {
  it('should be browser buffer', function () {
    expect(BufferType).equal(Buffer);
  });
});
