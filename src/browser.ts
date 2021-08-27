import {Buffer} from 'buffer';
import {BaseMutableBuffer} from './mbuf';

export class MutableBuffer extends BaseMutableBuffer {
  static readonly target = 'web';
  static Buffer = <any>Buffer;
}
