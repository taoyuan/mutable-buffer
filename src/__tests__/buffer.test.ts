import {expect} from '@tib/testlab';

import {Buffer as BufferType} from '../buffer';

describe('buffer', function () {
  it('should be nodejs builtin buffer', function () {
    expect(BufferType).equal(Buffer);
  });
});
