import createMutableBuffer, {MutableBuffer} from '..';
import {expect} from '@tib/testlab';

describe('main', function () {
  it('should export default mutable buffer initiator', function () {
    const buffer = createMutableBuffer();
    expect(buffer).instanceOf(MutableBuffer);
  });
});
